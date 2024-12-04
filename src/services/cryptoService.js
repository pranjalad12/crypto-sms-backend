const crypto = require('crypto');
const publicKey = `-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEfdyhxBC04SuegXNcidljN4VOymQ+
FNYN60iBRRYfS9X109k97IcWe+dcU/bYA1m9/nS7YGLu+VKBBtb7QVuOxg==
-----END PUBLIC KEY-----`;


function verifySignature(message, signature) {
  try {
    const verifier = crypto.createVerify('SHA256');
    verifier.update(message);
    verifier.end();
    return verifier.verify(publicKey, signature, 'base64');
  } catch (error) {
    console.error('Error verifying signature:', error.message);
    return false; // Return false if verification fails
  }
}

module.exports = { verifySignature };