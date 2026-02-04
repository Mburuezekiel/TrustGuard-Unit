const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number']
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  name: {
    type: String,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationOTP: String,
  verificationOTPExpire: Date,
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'premium', 'business'],
      default: 'free'
    },
    expiresAt: Date,
    features: {
      maxScansPerDay: { type: Number, default: 10 },
      aiAnalysis: { type: Boolean, default: false },
      trustCard: { type: Boolean, default: false },
      prioritySupport: { type: Boolean, default: false }
    }
  },
  stats: {
    scamsBlocked: { type: Number, default: 0 },
    reportsSubmitted: { type: Number, default: 0 },
    scansPerformed: { type: Number, default: 0 }
  },
  trustedContacts: [{
    name: String,
    phone: String,
    notifyOnHighRisk: { type: Boolean, default: true }
  }],
  preferences: {
    notifications: { type: Boolean, default: true },
    autoBlock: { type: Boolean, default: true },
    language: { type: String, default: 'en' }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: Date
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Sign JWT token
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// Generate OTP
UserSchema.methods.generateOTP = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.verificationOTP = otp;
  this.verificationOTPExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  return otp;
};

module.exports = mongoose.model('User', UserSchema);
