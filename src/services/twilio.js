const twilio = require('twilio');

// Twilio credentials from environment variables
const accountSid = 'AC6cab40a90179e217fd1f111e2971a731';
const authToken = '7061732136fbbeee16a52ca57b4eea19';
const twilioClient = twilio(accountSid, authToken);

// Function to send SMS
async function sendSMS(to, message) {
  try {
    const response = await twilioClient.messages.create({
      body: message,
      from: '+17752617597',
      to: to,
    });
    console.log(`SMS sent successfully: ${response.sid}`);
    return { success: true, sid: response.sid };
  } catch (error) {
    console.error('Error sending SMS:', error);
    return { success: false, error: error.message };
  }
}

module.exports = { sendSMS };
