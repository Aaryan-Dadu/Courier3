// login.ts

import { retrieveMessages, retrieveUserCID } from '../contract/userMaps.js';
import { dbPost, signUp, sendMail, retrieveUser, retrieveMsg } from '../funs';
import { generateKeyPair, encryptData, decryptData, hashPassword, encryptPrivateKey, decryptPrivateKey } from '../utils';


export async function runLogin(username: string, password: string): Promise<void> {
    const hashPass: string = hashPassword(password);
    const userCID = await retrieveUserCID(username, hashPass);
    const userData = await retrieveUser(userCID);
    console.log(userData);
    console.log(userData.privateKey); 
    const decryptedPrivateKey: string = decryptPrivateKey(userData.privateKey, userData.password);
    const messageCIDS = retrieveMessages(username);
    for (let msgCID in messageCIDS) {
        const msgData = await retrieveMsg(msgCID);
        const decryptedSub: string = decryptData(decryptedPrivateKey, msgData.subject);
        const decryptedBody: string = decryptData(decryptedPrivateKey, msgData.body);
        console.log(decryptedSub);
        console.log(decryptedBody);
    }
}