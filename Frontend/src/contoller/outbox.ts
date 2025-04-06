// outbox.ts

// import { retrieveOutbox } from "../contract/userMaps";
// import { retrieveMsg } from "../funs";
// import { decryptData } from "../utils";


// async function runOutbox(username: string, decryptedPrivateKey: string): Promise<void> {
//     const outboxMsgCIDS = await retrieveOutbox(username);
//     for (let msgCID in outboxMsgCIDS) {
//         const msgData = await retrieveMsg(msgCID);
//         const decryptedSub = decryptData(decryptedPrivateKey, msgData.subject);
//         const decryptedBody = decryptData(decryptedPrivateKey, msgData.body);
//         console.log(decryptedSub);
//         console.log(decryptedBody);
//     }
// }
