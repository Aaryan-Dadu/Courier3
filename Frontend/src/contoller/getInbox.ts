// login.ts

import { retrieveMessages, retrieveUserCID } from '../contract/userMaps.js';
import {  retrieveUser, retrieveMsg } from '../funs';
import { decryptData, hashPassword,  decryptPrivateKey } from '../utils';


export async function runLogin(username: string, password: string): Promise<void> {
    const hashPass: string = hashPassword(password);
    const userCID = await retrieveUserCID(username, hashPass);
    const userData = await retrieveUser(userCID);
    const decryptedPrivateKey: string = decryptPrivateKey(userData.privateKey, userData.password);
    const messageCIDS = retrieveMessages(username);
    for (let msgCID in messageCIDS) {
        const msgData = await retrieveMsg(msgCID);
        const decryptedSub: string = decryptData(decryptedPrivateKey, msgData.subject);
        const decryptedBody: string = decryptData(decryptedPrivateKey, msgData.body);
        console.log(decryptedSub);
        console.log(decryptedBody);
    }
    return 
}