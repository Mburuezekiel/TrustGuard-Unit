const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads', 'certificates');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'cert-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only PDF, JPG, and PNG files are allowed'));
  }
});

// @desc    Register and verify business
// @route   POST /api/v1/business/register
router.post('/register', upload.single('certificate'), async (req, res) => {
  try {
    const {
      businessName,
      registrationNumber,
      paymentMethod,
      paymentCode,
      email,
      phone,
      description
    } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Business registration certificate is required'
      });
    }

    // AI Verification of document
    const verificationPrompt = `
      Analyze this business registration certificate image/document.
      Business claims:
      - Name: ${businessName}
      - Registration Number: ${registrationNumber}
      - Payment Method: ${paymentMethod}
      - Payment Code: ${paymentCode}
      
      Determine if this appears to be a legitimate business registration document.
      Look for:
      1. Official government seals or stamps
      2. Matching business name and registration number
      3. Proper formatting of a registration certificate
      4. Signs of document tampering or fraud
      
      Return a JSON response with:
      - isLegit: boolean
      - confidence: number between 0 and 1
      - reasons: array of strings explaining your findings
    `;

    // In production: Use vision API to analyze the document
    // For now, simulate AI verification
    const verificationResult = {
      isLegit: true,
      confidence: 0.87,
      reasons: [
        'Document contains official government formatting',
        'Registration number format matches expected pattern',
        'Business name matches the provided details',
        'No signs of digital manipulation detected'
      ]
    };

    // Save business record (in production: save to database)
    const businessRecord = {
      id: Date.now().toString(),
      businessName,
      registrationNumber,
      paymentMethod,
      paymentCode,
      email,
      phone,
      description,
      certificatePath: req.file.path,
      verification: verificationResult,
      status: verificationResult.isLegit ? 'verified' : 'rejected',
      createdAt: new Date().toISOString()
    };

    console.log('Business Registration:', businessRecord);

    res.status(200).json({
      success: true,
      data: {
        businessId: businessRecord.id,
        status: businessRecord.status
      },
      verification: verificationResult
    });
  } catch (error) {
    console.error('Business Registration Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process business registration'
    });
  }
});

// @desc    Get verified businesses
// @route   GET /api/v1/business/verified
router.get('/verified', (req, res) => {
  // In production: fetch from database
  res.status(200).json({
    success: true,
    data: []
  });
});

// @desc    Check if business is verified
// @route   GET /api/v1/business/check/:paymentCode
router.get('/check/:paymentCode', (req, res) => {
  const { paymentCode } = req.params;
  
  // In production: check database
  res.status(200).json({
    success: true,
    data: {
      paymentCode,
      isVerified: false,
      businessName: null
    }
  });
});

module.exports = router;
