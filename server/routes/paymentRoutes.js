const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Create payment order
router.post('/create-order', auth, async (req, res) => {
  try {
    const { amount, plan, method } = req.body;
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Generate unique transaction ID
    const transactionId = 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    // For now, simulate payment success
    // In production, integrate actual payment gateway here
    
    // Create pending payment record
    user.paymentHistory.push({
      amount,
      method: method || 'JazzCash',
      transactionId,
      plan,
      status: 'pending',
      date: new Date()
    });
    await user.save();
    
    // Simulate payment success (in real app, wait for webhook)
    // For demo, we'll mark as completed immediately
    const paymentRecord = user.paymentHistory.find(p => p.transactionId === transactionId);
    if (paymentRecord) {
      paymentRecord.status = 'completed';
      user.isPremium = true;
      user.premiumPlan = plan;
      user.premiumExpiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
      await user.save();
    }
    
    res.json({
      success: true,
      message: 'Payment successful',
      transactionId,
      paymentUrl: '/payment-success'
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ message: 'Payment processing failed' });
  }
});

// Get payment history
router.get('/history', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.json(user.paymentHistory || []);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get premium status
router.get('/status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.json(user.getPremiumStatus());
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Webhook for payment gateway (JazzCash/EasyPaisa)
router.post('/webhook', async (req, res) => {
  try {
    const { transactionId, status } = req.body;
    
    // Find user by transaction ID
    const user = await User.findOne({ 'paymentHistory.transactionId': transactionId });
    if (!user) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    const payment = user.paymentHistory.find(p => p.transactionId === transactionId);
    if (payment && status === 'completed') {
      payment.status = 'completed';
      user.isPremium = true;
      user.premiumExpiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
      await user.save();
    }
    
    res.json({ received: true });
  } catch (error) {
    res.status(500).json({ message: 'Webhook error' });
  }
});

module.exports = router;