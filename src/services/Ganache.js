const { Web3 } = require('web3');

// Ganache setup
const web3 = new Web3('http://127.0.0.1:8545');

// Function to execute a transaction
async function executeTransaction(sender, receiver, amount) {
  try {
    const tx = await web3.eth.sendTransaction({
      from: sender,
      to: receiver,
      value: web3.utils.toWei(amount.toString(), 'ether'),
    });
    console.log('Transaction successful:', tx.transactionHash);
    return tx.transactionHash;
  } catch (error) {
    console.error('Error executing transaction:', error);
    throw new Error('Transaction failed.');
  }
}

// Function to check balance
async function checkBalance(address) {
  try {
    const balance = await web3.eth.getBalance(address);
    return web3.utils.fromWei(balance, 'ether');
  } catch (error) {
    console.error('Error checking balance:', error);
    throw new Error('Failed to check balance.');
  }
}

module.exports = { executeTransaction, checkBalance };
