const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true },
  cryptoAddress: { type: String, required: true },
  currentBalance: { type: Number, required: true, default: 0 },
  passkey: { type: String, default: null },
  amountLimit: { type: Number, default: 1000 },
  isActivated: { type: Boolean, required: true, default: false },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
