const express = require('express');
const { User } = require('../models');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET /api/user/me - Get current user info
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      id: user._id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error fetching user info' });
  }
});

module.exports = router;
