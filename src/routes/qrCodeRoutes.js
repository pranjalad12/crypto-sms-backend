const express = require('express');
const QRCode = require('qrcode');
const {translateText} = require('../services/Gemini');

const router = express.Router();

router.post('/getQRCode', async (req, res) => {
  try {
    const { recipientAddress, recipientCrypto, language } = req.body;

    // Validate required input fields
    if (!recipientAddress || !recipientCrypto) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Twilio phone number to receive the SMS
    const twilioPhoneNumber = '+17752617597';
    const targetLanguage = language || 'English';
    // Predefined SMS message format with placeholders for buyer input
    const message = `Welcome to Crypto SMS Wallet Offline Transaction!\n\nComplete the details below to send crypto:\n\nRecipient Address: ${recipientAddress}\nRecipient Crypto: ${recipientCrypto}\n---\nAmount to send (in USD): \nYour cryptocurrency to use (e.g., BTC, ETH): \nYour passkey: \n---\nDO NOT SEND BELOW THIS LINE`;
    const translatedMessage = targetLanguage === 'English' ? message : await translateText(message, targetLanguage);
    // Create the SMS URI
    const smsURI = `sms:${twilioPhoneNumber}?body=${encodeURIComponent(translatedMessage)}`;

    // Generate the QR Code
    const qrCode = await QRCode.toDataURL(smsURI);

    // Send the QR Code back to the frontend
    res.status(200).json({ qrCode });
  } catch (error) {
    console.error('Error generating QR Code:', error.message);
    res.status(500).json({ error: 'Failed to generate QR Code' });
  }
});

module.exports = router;
