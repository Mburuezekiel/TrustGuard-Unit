const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const blockchainController = require('../controllers/blockchain.controller');
const { protect, optionalAuth } = require('../middleware/auth');

// Validation
const validateLog = [
  body('type')
    .notEmpty()
    .withMessage('Message type is required'),
  body('content')
    .notEmpty()
    .withMessage('Content is required')
];

// Routes
router.post('/log', protect, validateLog, blockchainController.logMessage);
router.get('/verify/:hash', optionalAuth, blockchainController.verifyMessage);
router.get('/audit/:id', protect, blockchainController.getAuditTrail);

module.exports = router;
