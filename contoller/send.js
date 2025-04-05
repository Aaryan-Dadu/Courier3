import { sendMail } from "../funs";
import { encryptData } from "../utils";

const{ to, from, subject, body, timestamp} = '';

// Contract const ToPubKey = retrievePublicKey(to)

const EncryptData = encryptData(ToPubKey, {subject: subject, body: body});
// to handle

const CIDPost = sendMail(to, from, subject, body, timestamp);

// Contract MsgCid = addMessage(to, CIDPost);

const UserEncryptedData = encryptData(publicKeyUser, {subject: subject, body: body});

// Contract const UserCID = addOutbox(from, UserEncryptedData);

// Contract addOutbox(from, UserCID);