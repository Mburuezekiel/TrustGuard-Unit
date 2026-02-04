const { logToBlockchain, verifyMessage, logToQLDB } = require('../services/blockchain.service');

// @desc    Log message to blockchain
// @route   POST /api/v1/blockchain/log
exports.logMessage = async (req, res, next) => {
  try {
    const { type, content, metadata } = req.body;

    const result = await logToBlockchain({
      type,
      sender: req.user.id,
      recipient: metadata?.recipient || 'SYSTEM',
      content,
      category: metadata?.category || 'general',
      threatLevel: metadata?.threatLevel || 'safe',
      metadata
    });

    // Also log to QLDB for audit
    await logToQLDB('BLOCKCHAIN_LOG_CREATED', {
      userId: req.user.id,
      hash: result.hash,
      type
    });

    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify message hash
// @route   GET /api/v1/blockchain/verify/:hash
exports.verifyMessage = async (req, res, next) => {
  try {
    const { hash } = req.params;

    const result = await verifyMessage(hash);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get audit trail
// @route   GET /api/v1/blockchain/audit/:id
exports.getAuditTrail = async (req, res, next) => {
  try {
    // In production: Query QLDB for full audit history
    const { id } = req.params;

    const auditTrail = {
      documentId: id,
      entries: [
        {
          action: 'CREATED',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          details: 'Document created'
        },
        {
          action: 'VERIFIED',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          details: 'Document verified by community'
        },
        {
          action: 'UPDATED',
          timestamp: new Date().toISOString(),
          details: 'Document updated with new evidence'
        }
      ]
    };

    res.status(200).json({
      success: true,
      data: auditTrail
    });
  } catch (error) {
    next(error);
  }
};
