const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const reportController = require('../controllers/report.controller');
const { protect, optionalAuth } = require('../middleware/auth');

// Validation
const validateReport = [
  body('phoneNumber')
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage('Please provide a valid phone number'),
  body('type')
    .isIn(['call', 'sms'])
    .withMessage('Type must be call or sms'),
  body('category')
    .isIn([
      'irs_tax_scam', 'bank_fraud', 'tech_support_scam',
      'prize_lottery_scam', 'romance_scam', 'phishing',
      'telemarketer', 'identity_theft', 'investment_scam', 'other'
    ])
    .withMessage('Invalid category'),
  body('messageContent')
    .optional()
    .isLength({ max: 2000 })
];

const validateVote = [
  param('id').isMongoId(),
  body('vote')
    .isIn(['spam', 'notSpam'])
    .withMessage('Vote must be spam or notSpam')
];

// Routes
router.post('/', protect, validateReport, reportController.submitReport);
router.get('/', optionalAuth, reportController.getReports);
router.get('/trending', reportController.getTrendingScams);
router.get('/stats', reportController.getCommunityStats);
router.get('/:id', reportController.getReportById);
router.put('/:id/vote', protect, validateVote, reportController.voteOnReport);

module.exports = router;
