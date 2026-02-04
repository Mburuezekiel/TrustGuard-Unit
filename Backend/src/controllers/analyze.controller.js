const { validationResult } = require('express-validator');
const { analyzeMessage, classifyIntent, scorePhoneNumber } = require('../services/openai.service');
const { getReputation, storeReputation, publishAlert, invokeFraudModel } = require('../services/aws.service');
const { logToBlockchain } = require('../services/blockchain.service');
const NumberReputation = require('../models/NumberReputation');
const ScamReport = require('../models/ScamReport');

// @desc    Analyze SMS message for fraud
// @route   POST /api/v1/analyze/sms
exports.analyzeSMS = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { message, sender } = req.body;

    // Quick classification first
    const quickResult = await classifyIntent(message);

    // Full analysis for suspicious messages
    let fullAnalysis = null;
    if (quickResult.intent === 'scam' || quickResult.intent === 'spam') {
      fullAnalysis = await analyzeMessage(message, sender);
    }

    // Check sender reputation if provided
    let senderReputation = null;
    if (sender) {
      senderReputation = await NumberReputation.findOne({ phoneNumber: sender });
    }

    // Run SageMaker model for additional scoring
    const mlScore = await invokeFraudModel({
      messageLength: message.length,
      hasLinks: /https?:\/\//.test(message),
      hasPhoneNumbers: /\d{10,}/.test(message),
      urgencyWords: /(urgent|immediately|now|act fast)/i.test(message),
      financialKeywords: /(bank|money|transfer|pin|password|account)/i.test(message)
    });

    // Combine results
    const result = {
      quickClassification: quickResult,
      fullAnalysis,
      senderReputation: senderReputation ? {
        threatLevel: senderReputation.threatLevel,
        reputationScore: senderReputation.reputation.score,
        isVerified: senderReputation.isVerified,
        verifiedEntity: senderReputation.verifiedEntity
      } : null,
      mlScore: mlScore.confidence,
      overallRisk: calculateOverallRisk(quickResult, fullAnalysis, senderReputation, mlScore),
      analyzedAt: new Date().toISOString()
    };

    // Log to blockchain for audit
    const blockchainLog = await logToBlockchain({
      type: 'SMS_ANALYSIS',
      sender: sender || 'UNKNOWN',
      recipient: req.user?.id || 'ANONYMOUS',
      category: result.quickClassification.intent,
      threatLevel: result.overallRisk.level,
      metadata: { messageHash: require('crypto').createHash('sha256').update(message).digest('hex') }
    });

    result.blockchainHash = blockchainLog.hash;

    // Publish alert for high-risk messages
    if (result.overallRisk.score >= 70) {
      await publishAlert({
        userId: req.user?.id,
        sender,
        threatLevel: result.overallRisk.level,
        category: fullAnalysis?.category,
        timestamp: new Date().toISOString()
      });
    }

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// @desc    Analyze call audio
// @route   POST /api/v1/analyze/call
exports.analyzeCall = async (req, res, next) => {
  try {
    // In production: Use Google Cloud Speech-to-Text
    const { audioUrl, callerNumber, duration } = req.body;

    // Placeholder for speech-to-text transcription
    const transcript = "This is a placeholder transcript for the call audio.";

    // Analyze the transcript
    const analysis = await analyzeMessage(transcript, callerNumber);

    const result = {
      callerNumber,
      duration,
      transcript,
      analysis,
      analyzedAt: new Date().toISOString()
    };

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// @desc    Check phone number reputation
// @route   POST /api/v1/analyze/number
exports.checkNumber = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { phoneNumber } = req.body;

    // Check local database
    let reputation = await NumberReputation.findOne({ phoneNumber });

    // Check DynamoDB for real-time data
    const dynamoData = await getReputation(phoneNumber);

    // Get report history
    const reports = await ScamReport.find({ phoneNumber })
      .sort({ createdAt: -1 })
      .limit(10);

    // If no reputation exists, create one
    if (!reputation) {
      reputation = await NumberReputation.create({
        phoneNumber,
        metadata: {
          firstSeen: new Date(),
          lastSeen: new Date()
        }
      });
    }

    // AI scoring based on history
    let aiScore = null;
    if (reports.length > 0) {
      aiScore = await scorePhoneNumber(phoneNumber, reports);
    }

    const result = {
      phoneNumber,
      reputation: {
        score: reputation.reputation.score,
        threatLevel: reputation.threatLevel,
        isVerified: reputation.isVerified,
        verifiedEntity: reputation.verifiedEntity,
        totalReports: reputation.reputation.totalReports
      },
      recentReports: reports.map(r => ({
        category: r.category,
        threatLevel: r.threatLevel,
        date: r.createdAt
      })),
      aiScore,
      lastUpdated: reputation.updatedAt
    };

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's analysis history
// @route   GET /api/v1/analyze/history
exports.getAnalysisHistory = async (req, res, next) => {
  try {
    // In production: Fetch from analysis logs collection
    const history = [];

    res.status(200).json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
};

// @desc    Run full device scan
// @route   POST /api/v1/analyze/scan
exports.runFullScan = async (req, res, next) => {
  try {
    const { messages } = req.body;

    const results = {
      totalScanned: messages?.length || 0,
      threatsFound: 0,
      threats: [],
      cleanMessages: 0
    };

    // Analyze each message (batch processing)
    for (const msg of (messages || [])) {
      const classification = await classifyIntent(msg.content);
      
      if (classification.intent === 'scam' || classification.intent === 'spam') {
        results.threatsFound++;
        results.threats.push({
          number: msg.sender,
          content: msg.content.substring(0, 100),
          classification
        });
      } else {
        results.cleanMessages++;
      }
    }

    res.status(200).json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

// Helper: Calculate overall risk
function calculateOverallRisk(quick, full, reputation, ml) {
  let score = 0;
  let weights = { quick: 0.2, full: 0.4, reputation: 0.2, ml: 0.2 };

  // Quick classification score
  if (quick.intent === 'scam') score += 100 * weights.quick;
  else if (quick.intent === 'spam') score += 60 * weights.quick;

  // Full analysis score
  if (full) score += (full.riskScore || 0) * weights.full;

  // Reputation score (inverse - lower reputation = higher risk)
  if (reputation) {
    score += (100 - reputation.reputation.score) * weights.reputation;
  }

  // ML score
  score += (ml.confidence || 50) * weights.ml;

  // Determine level
  let level = 'safe';
  if (score >= 80) level = 'critical';
  else if (score >= 60) level = 'high';
  else if (score >= 40) level = 'medium';
  else if (score >= 20) level = 'low';

  return { score: Math.round(score), level };
}
