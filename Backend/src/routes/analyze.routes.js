const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const analyzeController = require('../controllers/analyze.controller');
const { protect, optionalAuth } = require('../middleware/auth');

// Validation
const validateSMSAnalysis = [
  body('message')
    .notEmpty()
    .withMessage('Message content is required')
    .isLength({ max: 1000 })
    .withMessage('Message too long'),
  body('sender')
    .optional()
    .isString()
];

const validateNumberCheck = [
  body('phoneNumber')
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage('Please provide a valid phone number')
];

// Routes
router.post('/sms', optionalAuth, validateSMSAnalysis, analyzeController.analyzeSMS);
router.post('/call', protect, analyzeController.analyzeCall);
router.post('/number', optionalAuth, validateNumberCheck, analyzeController.checkNumber);
router.get('/history', protect, analyzeController.getAnalysisHistory);
router.post('/scan', protect, analyzeController.runFullScan);

module.exports = router;
