const mongoose = require('mongoose');

const NumberReputationSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedEntity: {
    name: String,
    type: {
      type: String,
      enum: ['bank', 'government', 'business', 'telecom', 'other']
    },
    logo: String,
    website: String
  },
  reputation: {
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 50
    },
    totalReports: { type: Number, default: 0 },
    spamReports: { type: Number, default: 0 },
    safeReports: { type: Number, default: 0 },
    lastReportedAt: Date
  },
  threatLevel: {
    type: String,
    enum: ['safe', 'low', 'medium', 'high', 'critical'],
    default: 'low'
  },
  categories: [{
    category: String,
    count: Number,
    lastReported: Date
  }],
  aiAnalysis: {
    riskScore: Number,
    confidence: Number,
    indicators: [String],
    lastAnalyzed: Date
  },
  blockchainVerified: {
    type: Boolean,
    default: false
  },
  blockchainHash: String,
  metadata: {
    country: String,
    carrier: String,
    type: {
      type: String,
      enum: ['mobile', 'landline', 'voip', 'unknown']
    },
    firstSeen: Date,
    lastSeen: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
NumberReputationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Calculate threat level based on reputation
NumberReputationSchema.methods.updateThreatLevel = function() {
  const score = this.reputation.score;
  if (this.isVerified) {
    this.threatLevel = 'safe';
  } else if (score >= 80) {
    this.threatLevel = 'safe';
  } else if (score >= 60) {
    this.threatLevel = 'low';
  } else if (score >= 40) {
    this.threatLevel = 'medium';
  } else if (score >= 20) {
    this.threatLevel = 'high';
  } else {
    this.threatLevel = 'critical';
  }
  return this.threatLevel;
};

module.exports = mongoose.model('NumberReputation', NumberReputationSchema);
