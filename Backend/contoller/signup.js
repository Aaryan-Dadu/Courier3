import {dbPost, signUp, sendMail, retrieveUser, retrieveMsg} from '../funs.js';
import {generateKeyPair, encryptData, decryptData, hashPassword, encryptPrivateKey, decryptPrivateKey} from '../utils.js';

const username = 'abcd';
const password = 'def';

const { publicKey, privateKey }=generateKeyPair();
const hashPass = hashPassword(password);
const encryptedPrivateKey= encryptPrivateKey(privateKey, hashPass);
userDetailCID = signUp(username, hashPass, publicKey, encryptedPrivateKey);
// contract createUser(username, userDetailCID, hashPass, publicKey);
