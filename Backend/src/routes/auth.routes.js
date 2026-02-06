const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');

// Normalize common phone formats to E.164 (Kenya-friendly)
const normalizePhone = (value) => {
  let v = String(value ?? '').trim();
  if (!v) return v;

  v = v.replace(/[^\d+]/g, '');
  if (v.startsWith('00')) v = `+${v.slice(2)}`;

  if (!v.startsWith('+')) {
    if (v.startsWith('254')) v = `+${v}`;
    else if (v.startsWith('0') && v.length === 10) v = `+254${v.slice(1)}`;
    else if ((v.startsWith('7') || v.startsWith('1')) && v.length === 9) v = `+254${v}`;
  }

  return v;
};

// Validation middleware
const validateRegistration = [
  body('phone')
    .customSanitizer(normalizePhone)
    .matches(/^\+[1-9]\d{1,14}$/)
    .withMessage('Please provide a valid phone number'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email')
];

const validateLogin = [
  body('phone')
    .customSanitizer(normalizePhone)
    .matches(/^\+[1-9]\d{1,14}$/)
    .withMessage('Please provide a valid phone number'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Routes
router.post('/register', validateRegistration, authController.register);
router.post('/login', validateLogin, authController.login);
router.get('/me', protect, authController.getMe);
router.put('/update', protect, authController.updateDetails);
router.post('/logout', protect, authController.logout);

module.exports = router;

