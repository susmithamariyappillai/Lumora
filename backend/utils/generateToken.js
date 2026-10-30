const jwt = require('jsonwebtoken');

// Creates a signed login token that expires in 7 days.
module.exports = (userId) => jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
