const mongoose = require('mongoose');

const ScamReportSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required']
  },
  type: {
    type: String,
    enum: ['call', 'sms'],
    required: true
  },
  category: {
    type: String,
    enum: [
      'irs_tax_scam',
      'bank_fraud',
      'tech_support_scam',
      'prize_lottery_scam',
      'romance_scam',
      'phishing',
      'telemarketer',
      'identity_theft',
      'investment_scam',
      'other'
    ],
    required: true
  },
  threatLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  messageContent: String,
  callDetails: {
    duration: Number,
    audioUrl: String,
    transcript: String
  },
  aiAnalysis: {
    riskScore: Number,
    indicators: [String],
    explanation: String,
    model: String,
    analyzedAt: Date
  },
  blockchainHash: String,
  votes: {
    spam: { type: Number, default: 0 },
    notSpam: { type: Number, default: 0 }
  },
  voters: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    vote: { type: String, enum: ['spam', 'notSpam'] },
    votedAt: Date
  }],
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  metadata: {
    country: String,
    carrier: String,
    reportedFrom: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
ScamReportSchema.index({ phoneNumber: 1 });
ScamReportSchema.index({ category: 1 });
ScamReportSchema.index({ threatLevel: 1 });
ScamReportSchema.index({ createdAt: -1 });

// Calculate trust score based on votes
ScamReportSchema.methods.calculateTrustScore = function() {
  const totalVotes = this.votes.spam + this.votes.notSpam;
  if (totalVotes === 0) return 50;
  return Math.round((this.votes.spam / totalVotes) * 100);
};

module.exports = mongoose.model('ScamReport', ScamReportSchema);
