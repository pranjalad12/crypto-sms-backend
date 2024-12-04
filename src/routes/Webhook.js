const express = require('express');
const { extractSMSData } = require('../services/Gemini');
const { sendSMS } = require('../services/twilio');
const { findUserByPhone, findUserByCryptoAddress, updateUserBalance } = require('../services/userService');
const {executeTransaction} = require('../services/Ganache');
const { verifySignature } = require('../services/cryptoService');

const router = express.Router();

async function validateTransaction(senderPhoneNumber, recipientAddress, amountInUSD, passkey) {
    const senderUser = await findUserByPhone(senderPhoneNumber);
    const receiverUser = await findUserByCryptoAddress(recipientAddress);
  
    if (!senderUser) {
      return { valid: false, message: 'Sender phone number is not registered.' };
    }
    if (!receiverUser) {
      return { valid: false, message: 'Recipient address is not registered.' };
    }
    if (!senderUser.passkey || senderUser.passkey !== passkey) {
      return { valid: false, message: 'Incorrect passkey.' };
    }
    if (senderUser.currentBalance < amountInUSD) {
      return { valid: false, message: 'Insufficient balance.' };
    }
  
    return { valid: true, senderUser, receiverUser };
}

router.post('/', async (req, res) => {
  try {
    const { Body, From } = req.body;

    console.log(`Received SMS from ${From}: ${Body}`);
    // Extract the signature (last 96 characters) and the message
    const signature = Body.slice(-96); // Last 96 characters
    const message = Body.slice(0, -107).trim(); // Message without the signature

    console.log(`Extracted Signature: ${signature}`);
    console.log(`Message without Signature: ${message}`);

    // Verify the message with the hardcoded public key
    console.log("message is", message);
    console.log("signature is", signature);
    const isVerified = verifySignature(message, signature);

    if (!isVerified) {
      console.error('Signature verification failed. Message may have been altered.');
      await sendSMS(String(From), 'Transaction failed: Message verification failed. Possible tampering detected.');
      return res.status(400).send('Message verification failed.');
    }

    console.log('Signature verification succeeded.');
    const data = await extractSMSData(message);

    console.log('Extracted data:', data);
    const { recipientAddress, amountInUSD, cryptoType, passkey } = data;
    const amountInEther = parseFloat(amountInUSD) / 2000; // Assuming 1 ETH = $2000 (for testing)
    const validation = await validateTransaction(From, recipientAddress, amountInUSD, passkey);

    if (!validation.valid) {
        await sendSMS(From, `Transaction failed: ${validation.message}`);
        return res.status(400).send('Transaction validation failed');
      }
  
    const { senderUser, receiverUser } = validation;

    const txHash = await executeTransaction(senderUser.cryptoAddress, recipientAddress, amountInEther);
    if (!txHash) {
      await sendSMS(From, 'Transaction failed: Blockchain transaction could not be processed.');
      return res.status(500).send('Blockchain transaction failed');
    }

    // Update balances in MongoDB
    await updateUserBalance(senderUser.phoneNumber, senderUser.currentBalance - amountInUSD);
    await updateUserBalance(receiverUser.phoneNumber, receiverUser.currentBalance + amountInUSD);

    await sendSMS(String(From), `Transaction successful! Debited Amount: $${amountInUSD}. New balance: $${senderUser.currentBalance - amountInUSD}`);
    await sendSMS(String(receiverUser.phoneNumber), `You have received $${amountInUSD}. New balance: $${receiverUser.currentBalance + amountInUSD}`);

    res.status(200).send('Transaction processed successfully');
  } catch (error) {
    console.error('Error in webhook:', error.message);
    res.status(500).send('Failed to process SMS');
  }
});

module.exports = router;
