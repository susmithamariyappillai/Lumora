const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    // Get token from request
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        message: 'Please login first'
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token.split(' ')[1],
      process.env.JWT_SECRET
    );

    // Find user
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: 'User not found'
      });
    }
// save the user
    req.user = user;
    next();

  } catch (error) {
    res.status(401).json({
      message: 'Invalid token. Please login again'
    });
  }
};