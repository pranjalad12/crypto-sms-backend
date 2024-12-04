const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI('AIzaSyAWldom8x3mNas02BabMlPmi7JLfsnRm1s');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function extractSMSData(message) {
  const prompt = `Extract key-value pairs of recipientAddress, recipientCrypto, amountInUSD, cryptoType, and passkey from the following message and return them as a JSON object in english: \n${message}`;

  try {
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    let responseText = result.response.text();

    responseText = responseText.replace(/```(?:json)?/g, '').trim();
    const extractedData = JSON.parse(responseText);
    return extractedData;
  } catch (error) {
    console.error("Error extracting key-value pairs:", error);
    throw new Error("Failed to extract key-value pairs.");
  }
}

async function translateText(text, targetLanguage) {
    const prompt = `Translate the following text and don't change the formatting into ${targetLanguage}:\n"${text}"`;
  
    try {
      const result = await model.generateContent(prompt);
      let translatedText = result.response.text().trim();
      if (translatedText.startsWith('"') && translatedText.endsWith('"')) {
        translatedText = translatedText.slice(1, -1).trim();
      }
      console.log(`Translated text (${targetLanguage}):`, translatedText);
      return translatedText;
    } catch (error) {
      console.error("Error translating text:", error);
      throw new Error("Failed to translate text.");
    }
}
  
module.exports = {
  extractSMSData,
  translateText,
};
