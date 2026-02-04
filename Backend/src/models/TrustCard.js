const mongoose = require('mongoose');
const crypto = require('crypto');

const TransactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'payment', 'refund', 'fee'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    enum: ['USD', 'USDT', 'BTC', 'ETH'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  description: String,
  merchant: {
    name: String,
    category: String,
    verified: Boolean
  },
  fraudCheck: {
    passed: Boolean,
    riskScore: Number,
    flags: [String]
  },
  blockchainHash: String,
  metadata: {
    ip: String,
    device: String,
    location: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const TrustCardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  cardNumber: {
    type: String,
    required: true,
    unique: true
  },
  cardNumberEncrypted: {
    type: String,
    required: true,
    select: false
  },
  expiryDate: {
    type: String,
    required: true
  },
  cvv: {
    type: String,
    required: true,
    select: false
  },
  cardHolder: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'frozen', 'cancelled'],
    default: 'active'
  },
  balances: {
    usd: { type: Number, default: 0 },
    usdt: { type: Number, default: 0 },
    btc: { type: Number, default: 0 },
    eth: { type: Number, default: 0 }
  },
  limits: {
    daily: { type: Number, default: 5000 },
    monthly: { type: Number, default: 25000 },
    perTransaction: { type: Number, default: 2500 }
  },
  cryptoAddresses: {
    btc: String,
    eth: String,
    usdt: String
  },
  transactions: [TransactionSchema],
  securitySettings: {
    twoFactorEnabled: { type: Boolean, default: false },
    notifyOnTransaction: { type: Boolean, default: true },
    blockInternational: { type: Boolean, default: false },
    fraudProtection: { type: Boolean, default: true }
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

// Generate card number
TrustCardSchema.statics.generateCardNumber = function() {
  const prefix = '4532'; // Visa-like prefix
  const random = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join('');
  return prefix + random;
};

// Generate crypto address (placeholder)
TrustCardSchema.statics.generateCryptoAddress = function(type) {
  const chars = '0123456789abcdef';
  let address = '';
  if (type === 'btc') {
    address = 'bc1q' + Array.from({ length: 39 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  } else {
    address = '0x' + Array.from({ length: 40 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }
  return address;
};

// Mask card number
TrustCardSchema.methods.getMaskedNumber = function() {
  return '•••• •••• •••• ' + this.cardNumber.slice(-4);
};

module.exports = mongoose.model('TrustCard', TrustCardSchema);
