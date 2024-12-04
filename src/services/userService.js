const User = require('../models/user');

async function findUserByPhone(phoneNumber) {
  return await User.findOne({ phoneNumber });
}

async function findUserByCryptoAddress(cryptoAddress) {
    return await User.findOne({ cryptoAddress });
}

async function updateUserSettings(phoneNumber, passkey, amountLimit) {
  return await User.findOneAndUpdate(
    { phoneNumber },
    { passkey, amountLimit, isActivated: true },
    { new: true, upsert: false }
  );
}

async function updateUserBalance(phoneNumber, newBalance) {
    return await User.findOneAndUpdate(
      { phoneNumber },
      { currentBalance: newBalance },
      { new: true, upsert: false }
    );
}

module.exports = { findUserByPhone, findUserByCryptoAddress, updateUserSettings, updateUserBalance };