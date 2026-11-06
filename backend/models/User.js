const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  passwordHash: String
}, { timestamps: true });

// check the password in user login

userSchema.methods.matchPassword = function(password) {
  return bcrypt.compare(password, this.passwordHash);
};
// create a new user with hashed password
userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

module.exports = mongoose.model('User', userSchema);