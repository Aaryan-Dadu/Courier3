import {dbPost, signUp, sendMail, retrieveUser, retrieveMsg} from '../funs.js';
import {generateKeyPair, encryptData, decryptData, hashPassword, encryptPrivateKey, decryptPrivateKey} from '../utils.js';

const username = 'abcd';
const password = 'def';

const hashPass=hashPassword(password);
// Contract const userCID = retrieveUserCID(username, hashPass);
const userData = retrieveUser(userCID);
const decryptedPrivateKey = decryptPrivateKey(userData.privateKey, userData.password);
// Contract const messages = retrieveMessages(username);
// for(Message in messages){
//     message
 // decrypt each message and store it in an array and map it to frontend
// }

// Implement the refresh button functionality in the frontend
