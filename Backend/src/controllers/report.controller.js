const { validationResult } = require('express-validator');
const ScamReport = require('../models/ScamReport');
const NumberReputation = require('../models/NumberReputation');
const User = require('../models/User');
const { analyzeMessage } = require('../services/openai.service');
const { storeEvidence, storeReputation, publishAlert } = require('../services/aws.service');
const { logToBlockchain } = require('../services/blockchain.service');

// @desc    Submit fraud report
// @route   POST /api/v1/reports
exports.submitReport = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { phoneNumber, type, category, messageContent, threatLevel } = req.body;

    // AI analysis of the content
    let aiAnalysis = null;
    if (messageContent) {
      aiAnalysis = await analyzeMessage(messageContent, phoneNumber);
    }

    // Create report
    const report = await ScamReport.create({
      reporter: req.user.id,
      phoneNumber,
      type,
      category,
      messageContent,
      threatLevel: threatLevel || (aiAnalysis?.threatLevel || 'medium'),
      aiAnalysis
    });

    // Log to blockchain
    const blockchainLog = await logToBlockchain({
      type: 'SCAM_REPORT',
      sender: phoneNumber,
      recipient: req.user.id,
      category,
      threatLevel: report.threatLevel,
      metadata: { reportId: report._id.toString() }
    });

    report.blockchainHash = blockchainLog.hash;
    await report.save();

    // Store evidence
    await storeEvidence(report._id.toString(), {
      phoneNumber,
      type,
      category,
      content: messageContent,
      analysis: aiAnalysis
    });

    // Update number reputation
    let reputation = await NumberReputation.findOne({ phoneNumber });
    if (!reputation) {
      reputation = new NumberReputation({ phoneNumber });
    }

    reputation.reputation.totalReports++;
    reputation.reputation.spamReports++;
    reputation.reputation.lastReportedAt = new Date();
    reputation.reputation.score = Math.max(0, reputation.reputation.score - 5);
    
    // Add category
    const existingCategory = reputation.categories.find(c => c.category === category);
    if (existingCategory) {
      existingCategory.count++;
      existingCategory.lastReported = new Date();
    } else {
      reputation.categories.push({ category, count: 1, lastReported: new Date() });
    }

    reputation.updateThreatLevel();
    await reputation.save();

    // Sync to DynamoDB
    await storeReputation(phoneNumber, {
      riskScore: 100 - reputation.reputation.score,
      threatLevel: reputation.threatLevel,
      totalReports: reputation.reputation.totalReports,
      categories: reputation.categories.map(c => c.category)
    });

    // Update user stats
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { 'stats.reportsSubmitted': 1 }
    });

    // Publish alert for high-risk reports
    if (report.threatLevel === 'high') {
      await publishAlert({
        type: 'NEW_HIGH_RISK_REPORT',
        phoneNumber,
        category,
        reportId: report._id.toString(),
        timestamp: new Date().toISOString()
      });
    }

    res.status(201).json({
      success: true,
      data: report,
      message: 'Thank you for helping protect the community!'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reports (with filters)
// @route   GET /api/v1/reports
exports.getReports = async (req, res, next) => {
  try {
    const { category, threatLevel, type, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (threatLevel) filter.threatLevel = threatLevel;
    if (type) filter.type = type;

    const reports = await ScamReport.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('reporter', 'name');

    const total = await ScamReport.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: reports.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: reports
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get trending scams
// @route   GET /api/v1/reports/trending
exports.getTrendingScams = async (req, res, next) => {
  try {
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const trending = await ScamReport.aggregate([
      { $match: { createdAt: { $gte: last24Hours } } },
      { $group: {
        _id: '$category',
        count: { $sum: 1 },
        avgThreatLevel: { $avg: { $cond: [{ $eq: ['$threatLevel', 'high'] }, 3, { $cond: [{ $eq: ['$threatLevel', 'medium'] }, 2, 1] }] } }
      }},
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({ success: true, data: trending });
  } catch (error) {
    next(error);
  }
};

// @desc    Get community stats
// @route   GET /api/v1/reports/stats
exports.getCommunityStats = async (req, res, next) => {
  try {
    const totalReports = await ScamReport.countDocuments();
    const verifiedReports = await ScamReport.countDocuments({ status: 'verified' });
    const totalUsers = await User.countDocuments();
    const reportsToday = await ScamReport.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    });

    res.status(200).json({
      success: true,
      data: {
        totalReports,
        verifiedReports,
        totalUsers,
        reportsToday,
        communitySize: totalUsers > 1000000 ? `${(totalUsers / 1000000).toFixed(1)}M` : `${Math.round(totalUsers / 1000)}K`
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get report by ID
// @route   GET /api/v1/reports/:id
exports.getReportById = async (req, res, next) => {
  try {
    const report = await ScamReport.findById(req.params.id)
      .populate('reporter', 'name');

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.status(200).json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

// @desc    Vote on report
// @route   PUT /api/v1/reports/:id/vote
exports.voteOnReport = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { vote } = req.body;
    const report = await ScamReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Check if user already voted
    const existingVote = report.voters.find(v => v.user.toString() === req.user.id);
    if (existingVote) {
      return res.status(400).json({ error: 'You have already voted on this report' });
    }

    // Add vote
    report.votes[vote]++;
    report.voters.push({
      user: req.user.id,
      vote,
      votedAt: new Date()
    });

    // Update status if enough votes
    const totalVotes = report.votes.spam + report.votes.notSpam;
    if (totalVotes >= 10) {
      report.status = report.votes.spam > report.votes.notSpam ? 'verified' : 'rejected';
    }

    await report.save();

    res.status(200).json({
      success: true,
      data: {
        votes: report.votes,
        status: report.status,
        trustScore: report.calculateTrustScore()
      }
    });
  } catch (error) {
    next(error);
  }
};
