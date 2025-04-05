// contract Outbox = retrieveOutbox(username);

import { decryptData } from "../utils";

const privateKey = 'ssadds';

// Contract const userCID = retrieveUserCID(username, hashPass);
for(message in Outbox){
    // decrypt each message
    decryptData(privateKey, message);
}