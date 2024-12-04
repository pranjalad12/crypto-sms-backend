const express = require('express');
const crypto = require('crypto');

const router = express.Router();

// Generate key pair for a phone number
router.post('/generateKeys', (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Generate ECDSA key pair (P-256 curve)
    const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
      namedCurve: 'P-256', // Use P-256 curve for short keys
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });

    // Return keys as a JSON object
    res.status(200).json({
      phoneNumber,
      publicKey,
      privateKey,
    });
  } catch (error) {
    console.error('Error generating keys:', error.message);
    res.status(500).json({ error: 'Failed to generate keys' });
  }
});

// Sign a message
router.post('/signMessage', (req, res) => {
  try {
    const { privateKey, message } = req.body;

    if (!privateKey || !message) {
      return res.status(400).json({ error: 'Private key and message are required' });
    }

    // Create a signature for the message
    const sign = crypto.createSign('SHA256');
    sign.update(message);
    sign.end();
    const signature = sign.sign(privateKey, 'base64'); // Base64-encoded signature

    res.status(200).json({
      signature,
    });
  } catch (error) {
    console.error('Error signing message:', error.message);
    res.status(500).json({ error: 'Failed to sign message' });
  }
});

// Verify a signature
router.post('/verifySignature', (req, res) => {
  try {
    const { publicKey, message, signature } = req.body;

    if (!publicKey || !message || !signature) {
      return res.status(400).json({ error: 'Public key, message, and signature are required' });
    }

    // Verify the signature
    const verify = crypto.createVerify('SHA256');
    verify.update(message);
    verify.end();
    const isValid = verify.verify(publicKey, signature, 'base64');

    res.status(200).json({
      valid: isValid,
    });
  } catch (error) {
    console.error('Error verifying signature:', error.message);
    res.status(500).json({ error: 'Failed to verify signature' });
  }
});

module.exports = router;
