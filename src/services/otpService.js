const OTP = require('../models/otp');

async function createOtp(phoneNumber, otp) {
    // Check if an OTP already exists for the phone number
    const existingOtp = await OTP.findOne({ phoneNumber });
  
    if (existingOtp) {
      // Update the existing OTP
      existingOtp.otp = otp;
      return await existingOtp.save();
    } else {
      // Create a new OTP record
      const newOtp = new OTP({ phoneNumber, otp });
      return await newOtp.save();
    }
  }

async function verifyOtp(phoneNumber, otp) {
  const otpRecord = await OTP.findOne({ phoneNumber, otp });
  if (!otpRecord) return false;
  return true;
}

module.exports = { createOtp, verifyOtp };
