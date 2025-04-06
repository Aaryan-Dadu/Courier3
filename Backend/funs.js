require('dotenv').config();

export async function dbPost(data) {
  const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
  const options = {
    method: 'POST',
    headers: {
     'Content-Type': 'application/json', 
      pinata_api_key: process.env.PINATA_API_KEY,
      pinata_secret_api_key: process.env.PINATA_API_SECRET,
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log('Pinata response:', result);
    if (result && result.IpfsHash) {
      return result.IpfsHash;
    } else {
      throw new Error('No IpfsHash returned from Pinata');
    }
  } catch (error) {
    console.error('Error uploading to Pinata:', error);
    throw error;
  }
}

export async function signUp(username, password, publicKey, privateKey){
  const data = { username, password, publicKey, privateKey};
  const cid = await dbPost(data);
  console.log('Signup CID:', cid);
  return cid;
}

export async function sendMail(to, from, subject, body, timestamp) {
  const data = { to, from, subject, body, timestamp };
  const cid = await dbPost(data);
  console.log('Mail CID:', cid);
  return cid;
}

export async function retrieveUser(cid) {
  const url = `https://gateway.pinata.cloud/ipfs/${cid}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log('Retrieved User:', data);
    return data;
  } catch (error) {
    console.error('Error retrieving user from IPFS:', error);
    throw error;
  }
}

export async function retrieveMsg(cid) {
  const url = `https://gateway.pinata.cloud/ipfs/${cid}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log('Retrieved Message:', data);
    return data;
  } catch (error) {
    console.error('Error retrieving message from IPFS:', error);
    throw error;
  }
}
// (async () => {
//   try {
//     const signupCid = await signUp("exampleUser", "securePassword123");
    
//     const mailCid = await sendMail("exampleUser@example.com", "Hello", "This is a test mail.", Date.now());
    
//     console.log('Signup Data CID:', signupCid);
//     console.log('Mail Data CID:', mailCid);
//   } catch (error) {
//     console.error('Operation failed:', error);
//   }
// })();
