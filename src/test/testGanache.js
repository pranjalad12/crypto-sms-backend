const { executeTransaction } = require('../services/Ganache'); // Adjust path if needed
const { Web3 } = require('web3');

async function testExecuteTransaction() {
  try {
    // Ganache setup
    const web3 = new Web3('http://127.0.0.1:8545');

    // Replace with your provided addresses
    const sender = '0xDB43C56E14D41CeA246c0f61Cb1A4ffe5a7Ef6AB';
    const receiver = '0x06cf5B3532F21c1870452B67C7Ee7a124553aCc0';
    const amount = 0.01; // Ether to send

    console.log(`Sender: ${sender}`);
    console.log(`Receiver: ${receiver}`);
    console.log(`Amount: ${amount} Ether`);

    // Step 1: Check sender's initial balance
    const senderBalance = await web3.eth.getBalance(sender);
    console.log(`Sender's initial balance: ${web3.utils.fromWei(senderBalance, 'ether')} Ether`);

    // Step 2: Execute the transaction
    console.log('Executing transaction...');
    const txHash = await executeTransaction(sender, receiver, amount);
    console.log(`Transaction successful! Hash: ${txHash}`);

    // Step 3: Check updated balances
    const updatedSenderBalance = await web3.eth.getBalance(sender);
    const updatedReceiverBalance = await web3.eth.getBalance(receiver);

    console.log(`Sender's updated balance: ${web3.utils.fromWei(updatedSenderBalance, 'ether')} Ether`);
    console.log(`Receiver's updated balance: ${web3.utils.fromWei(updatedReceiverBalance, 'ether')} Ether`);
  } catch (error) {
    console.error('Error in test:', error.message);
  }
}

testExecuteTransaction();
