import { uploadJSON } from './uploadToPinata.js'

const email = {
  from: '0xSenderAddress',
  to: '0xReceiverAddress',
  subject: 'Hello from Web3!',
  body: 'Hey! This is a decentralized email!',
  timestamp: Date.now(),
}

async function sendEmail() {
  const cid = await uploadJSON(email)
  console.log('📤 Email uploaded to IPFS CID:', cid)
}

sendEmail()
