const TrustCard = require('../models/TrustCard');
const { logToBlockchain, logToQLDB } = require('../services/blockchain.service');

// @desc    Create TrustCard
// @route   POST /api/v1/trustcard/create
exports.createCard = async (req, res, next) => {
  try {
    // Check if user already has a card
    const existingCard = await TrustCard.findOne({ user: req.user.id });
    if (existingCard) {
      return res.status(400).json({ error: 'You already have a TrustCard' });
    }

    // Generate card details
    const cardNumber = TrustCard.generateCardNumber();
    const expiryDate = new Date(Date.now() + 4 * 365 * 24 * 60 * 60 * 1000); // 4 years
    const cvv = Math.floor(100 + Math.random() * 900).toString();

    const card = await TrustCard.create({
      user: req.user.id,
      cardNumber,
      cardNumberEncrypted: require('crypto').createHash('sha256').update(cardNumber).digest('hex'),
      expiryDate: `${(expiryDate.getMonth() + 1).toString().padStart(2, '0')}/${expiryDate.getFullYear().toString().slice(-2)}`,
      cvv,
      cardHolder: req.user.name?.toUpperCase() || 'SCAMALERT USER',
      cryptoAddresses: {
        btc: TrustCard.generateCryptoAddress('btc'),
        eth: TrustCard.generateCryptoAddress('eth'),
        usdt: TrustCard.generateCryptoAddress('eth')
      }
    });

    // Log to blockchain
    await logToBlockchain({
      type: 'TRUSTCARD_CREATED',
      sender: 'SYSTEM',
      recipient: req.user.id,
      category: 'trustcard',
      threatLevel: 'safe',
      metadata: { cardId: card._id.toString() }
    });

    res.status(201).json({
      success: true,
      data: {
        id: card._id,
        cardNumber: card.getMaskedNumber(),
        expiryDate: card.expiryDate,
        cardHolder: card.cardHolder,
        status: card.status,
        balances: card.balances,
        cryptoAddresses: card.cryptoAddresses
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's TrustCard
// @route   GET /api/v1/trustcard
exports.getCard = async (req, res, next) => {
  try {
    const card = await TrustCard.findOne({ user: req.user.id });

    if (!card) {
      return res.status(404).json({ error: 'TrustCard not found. Create one first.' });
    }

    res.status(200).json({
      success: true,
      data: {
        id: card._id,
        cardNumber: card.getMaskedNumber(),
        fullCardNumber: card.cardNumber, // Only show if user requests reveal
        expiryDate: card.expiryDate,
        cardHolder: card.cardHolder,
        status: card.status,
        balances: card.balances,
        limits: card.limits,
        cryptoAddresses: card.cryptoAddresses,
        securitySettings: card.securitySettings
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get card balance
// @route   GET /api/v1/trustcard/balance
exports.getBalance = async (req, res, next) => {
  try {
    const card = await TrustCard.findOne({ user: req.user.id });

    if (!card) {
      return res.status(404).json({ error: 'TrustCard not found' });
    }

    res.status(200).json({
      success: true,
      data: card.balances
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Load funds to card
// @route   POST /api/v1/trustcard/load
exports.loadFunds = async (req, res, next) => {
  try {
    const { amount, currency, method } = req.body;

    const card = await TrustCard.findOne({ user: req.user.id });
    if (!card) {
      return res.status(404).json({ error: 'TrustCard not found' });
    }

    if (card.status !== 'active') {
      return res.status(400).json({ error: 'Card is not active' });
    }

    // Create pending transaction
    const transaction = {
      type: 'deposit',
      amount,
      currency,
      status: 'pending',
      description: `${method.toUpperCase()} deposit`,
      metadata: { method }
    };

    card.transactions.push(transaction);

    // In production: Integrate with payment provider
    // For demo: Auto-approve
    const tx = card.transactions[card.transactions.length - 1];
    tx.status = 'completed';
    
    // Update balance
    const currencyKey = currency.toLowerCase();
    card.balances[currencyKey] = (card.balances[currencyKey] || 0) + amount;

    // Log to blockchain
    const blockchainLog = await logToBlockchain({
      type: 'TRUSTCARD_DEPOSIT',
      sender: 'EXTERNAL',
      recipient: req.user.id,
      category: 'trustcard',
      threatLevel: 'safe',
      metadata: { amount, currency, method }
    });

    tx.blockchainHash = blockchainLog.hash;
    await card.save();

    await logToQLDB('TRUSTCARD_FUND_LOADED', {
      userId: req.user.id,
      amount,
      currency,
      method
    });

    res.status(200).json({
      success: true,
      data: {
        transaction: tx,
        newBalance: card.balances[currencyKey]
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Make payment
// @route   POST /api/v1/trustcard/pay
exports.makePayment = async (req, res, next) => {
  try {
    const { amount, currency, recipient, description } = req.body;

    const card = await TrustCard.findOne({ user: req.user.id });
    if (!card) {
      return res.status(404).json({ error: 'TrustCard not found' });
    }

    if (card.status !== 'active') {
      return res.status(400).json({ error: 'Card is not active' });
    }

    const currencyKey = currency.toLowerCase();
    if (card.balances[currencyKey] < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Check limits
    if (amount > card.limits.perTransaction) {
      return res.status(400).json({ error: 'Amount exceeds transaction limit' });
    }

    // Fraud check (placeholder)
    const fraudCheck = {
      passed: true,
      riskScore: 15,
      flags: []
    };

    // Create transaction
    const transaction = {
      type: 'payment',
      amount: -amount,
      currency,
      status: 'completed',
      description: description || `Payment to ${recipient}`,
      merchant: { name: recipient },
      fraudCheck,
      metadata: { recipient }
    };

    // Update balance
    card.balances[currencyKey] -= amount;
    card.transactions.push(transaction);

    // Log to blockchain
    const blockchainLog = await logToBlockchain({
      type: 'TRUSTCARD_PAYMENT',
      sender: req.user.id,
      recipient,
      category: 'trustcard',
      threatLevel: 'safe',
      metadata: { amount, currency }
    });

    card.transactions[card.transactions.length - 1].blockchainHash = blockchainLog.hash;
    await card.save();

    res.status(200).json({
      success: true,
      data: {
        transaction: card.transactions[card.transactions.length - 1],
        newBalance: card.balances[currencyKey]
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get transactions
// @route   GET /api/v1/trustcard/transactions
exports.getTransactions = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const card = await TrustCard.findOne({ user: req.user.id });
    if (!card) {
      return res.status(404).json({ error: 'TrustCard not found' });
    }

    const transactions = card.transactions
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice((page - 1) * limit, page * limit);

    res.status(200).json({
      success: true,
      count: transactions.length,
      total: card.transactions.length,
      data: transactions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update security settings
// @route   PUT /api/v1/trustcard/settings
exports.updateSettings = async (req, res, next) => {
  try {
    const card = await TrustCard.findOne({ user: req.user.id });
    if (!card) {
      return res.status(404).json({ error: 'TrustCard not found' });
    }

    const { securitySettings, limits } = req.body;

    if (securitySettings) {
      card.securitySettings = { ...card.securitySettings, ...securitySettings };
    }

    if (limits) {
      card.limits = { ...card.limits, ...limits };
    }

    await card.save();

    res.status(200).json({
      success: true,
      data: {
        securitySettings: card.securitySettings,
        limits: card.limits
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Freeze card
// @route   POST /api/v1/trustcard/freeze
exports.freezeCard = async (req, res, next) => {
  try {
    const card = await TrustCard.findOneAndUpdate(
      { user: req.user.id },
      { status: 'frozen' },
      { new: true }
    );

    if (!card) {
      return res.status(404).json({ error: 'TrustCard not found' });
    }

    await logToQLDB('TRUSTCARD_FROZEN', { userId: req.user.id });

    res.status(200).json({
      success: true,
      message: 'Card has been frozen',
      data: { status: card.status }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unfreeze card
// @route   POST /api/v1/trustcard/unfreeze
exports.unfreezeCard = async (req, res, next) => {
  try {
    const card = await TrustCard.findOneAndUpdate(
      { user: req.user.id, status: 'frozen' },
      { status: 'active' },
      { new: true }
    );

    if (!card) {
      return res.status(404).json({ error: 'TrustCard not found or not frozen' });
    }

    await logToQLDB('TRUSTCARD_UNFROZEN', { userId: req.user.id });

    res.status(200).json({
      success: true,
      message: 'Card has been unfrozen',
      data: { status: card.status }
    });
  } catch (error) {
    next(error);
  }
};
