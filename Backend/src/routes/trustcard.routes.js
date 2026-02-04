const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const trustcardController = require('../controllers/trustcard.controller');
const { protect } = require('../middleware/auth');

// All TrustCard routes require authentication
router.use(protect);

// Validation
const validateLoad = [
  body('amount')
    .isFloat({ min: 1, max: 10000 })
    .withMessage('Amount must be between 1 and 10000'),
  body('currency')
    .isIn(['USD', 'USDT', 'BTC', 'ETH'])
    .withMessage('Invalid currency'),
  body('method')
    .isIn(['mpesa', 'bank', 'crypto'])
    .withMessage('Invalid payment method')
];

const validatePayment = [
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Invalid amount'),
  body('currency')
    .isIn(['USD', 'USDT', 'BTC', 'ETH'])
    .withMessage('Invalid currency'),
  body('recipient')
    .notEmpty()
    .withMessage('Recipient is required')
];

// Routes
router.post('/create', trustcardController.createCard);
router.get('/', trustcardController.getCard);
router.get('/balance', trustcardController.getBalance);
router.post('/load', validateLoad, trustcardController.loadFunds);
router.post('/pay', validatePayment, trustcardController.makePayment);
router.get('/transactions', trustcardController.getTransactions);
router.put('/settings', trustcardController.updateSettings);
router.post('/freeze', trustcardController.freezeCard);
router.post('/unfreeze', trustcardController.unfreezeCard);

module.exports = router;
