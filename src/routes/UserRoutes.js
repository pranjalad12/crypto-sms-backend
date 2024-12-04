const express = require('express');
const { findUserByPhone, updateUserSettings } = require('../services/userService');
const { createOtp, verifyOtp } = require('../services/otpService');
const { sendSMS } = require('../services/twilio');

const router = express.Router();

// Verify Phone Number
router.post('/verifyPhoneNumber', async (req, res) => {
  const { phoneNumber } = req.body;
  // console.log(phoneNumber);
  try {
    const user = await findUserByPhone(phoneNumber);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isActivated) {
      return res.status(400).json({ error: 'Number is linked to another crypto address.' });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    console.log("The otp is: ", otp);
    await createOtp(phoneNumber, otp);
    await sendSMS(phoneNumber, `Your OTP is: ${otp}`);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify phone number', details: error.message });
  }
});

// Verify OTP
router.post('/verifyOtp', async (req, res) => {
  const { phoneNumber, otp } = req.body;
  try {
    const isValid = await verifyOtp(phoneNumber, otp);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify OTP', details: error.message });
  }
});

// Set Account Settings
router.post('/setAccountSettings', async (req, res) => {
  const { phoneNumber, passkey, amountLimit } = req.body;
  try {
    const updatedUser = await updateUserSettings(phoneNumber, passkey, amountLimit);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Account settings updated', user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update account settings', details: error.message });
  }
});

// Get Balance
router.get('/getBalance/:phoneNumber', async (req, res) => {
  const { phoneNumber } = req.params;
  try {
    const user = await findUserByPhone(phoneNumber);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ balance: user.currentBalance });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve balance', details: error.message });
  }
});

module.exports = router;
