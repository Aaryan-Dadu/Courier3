// send.ts
import { addMessage, addOutbox, retrievePublicKey } from "../contract/userMaps";
import { sendMail } from "../funs"; // Assuming sendMail is typed correctly or we infer its signature
import { encryptData } from "../utils"; // Assuming encryptData is typed correctly
// import dotenv from 'dotenv';

// dotenv.config(); // Ensure environment variables are loaded for contract interactions

// Define the function to handle sending mail
// It takes sender, recipient, subject, and body as input
export async function runSend(
    from: string,
    to: string,
    subject: string,
    body: string
): Promise<void> { // Returns nothing on success (void)

    console.log(`Attempting to send mail from "${from}" to "${to}"`);
    const timestamp = Date.now().toString(); // Generate timestamp

    try {
        // --- 1. Process for Recipient ---
        console.log(`Retrieving public key for recipient: ${to}...`);
        // Retrieve recipient's public key from the blockchain
        const toPubKey: string = await retrievePublicKey(to);
        if (!toPubKey) {
             throw new Error(`Could not retrieve public key for recipient: ${to}. User might not exist.`);
        }
        console.log(`Recipient public key retrieved.`);

        console.log("Encrypting message for recipient...");
        // Encrypt subject and body using recipient's public key
        const encryptedSubRecipient: string = encryptData(toPubKey, subject);
        const encryptedBodyRecipient: string = encryptData(toPubKey, body);
        console.log("Encryption for recipient complete.");

        console.log("Storing recipient-encrypted message on IPFS...");
        // Store the recipient-encrypted version on IPFS
        // Assuming sendMail expects: to, from, subject, body, timestamp
        const recipientCID: string = await sendMail(to, from, encryptedSubRecipient, encryptedBodyRecipient, timestamp);
        console.log(`Recipient message stored on IPFS. CID: ${recipientCID}`);

        console.log(`Adding message CID to recipient's inbox (${to})...`);
        // Add the IPFS CID to the recipient's message list on the blockchain
        const addMsgResult: string = await addMessage(to, recipientCID);
        console.log(`Contract addMessage result: ${addMsgResult}`);


        // --- 2. Process for Sender's Outbox ---
        console.log(`Retrieving public key for sender: ${from}...`);
        // Retrieve the *sender's* public key for their outbox copy
        const fromPubKey: string = await retrievePublicKey(from);
         if (!fromPubKey) {
             throw new Error(`Could not retrieve public key for sender: ${from}. User might not exist.`);
        }
        console.log(`Sender public key retrieved.`);

        console.log("Encrypting message for sender's outbox...");
        // Encrypt subject and body using the *sender's* public key
        const encryptedSubSender: string = encryptData(fromPubKey, subject);
        const encryptedBodySender: string = encryptData(fromPubKey, body);
        console.log("Encryption for sender complete.");

        console.log("Storing sender-encrypted message on IPFS for outbox...");
        // Store the sender-encrypted version on IPFS
        const senderCID: string = await sendMail(to, from, encryptedSubSender, encryptedBodySender, timestamp);
        console.log(`Sender outbox message stored on IPFS. CID: ${senderCID}`);
        await addMessage(to, senderCID);

        console.log(`Adding message CID to sender's outbox (${from})...`);
        // Add this CID to the sender's outbox list on the blockchain
        const addOutboxResult: string = await addOutbox(from, senderCID);
        console.log(`Contract addOutbox result: ${addOutboxResult}`);

        console.log("--- Mail send process completed successfully! ---");

    } catch (error: unknown) { // Use 'unknown' for safer error handling
        console.error("--- Send mail process failed! ---");
        if (error instanceof Error) {
            console.error("Error message:", error.message);
            // Check for specific contract revert reasons
            const potentialEthersError = error as any;
             if (potentialEthersError.reason) {
                console.error("Contract Revert Reason:", potentialEthersError.reason);
            }
             if (potentialEthersError.code) {
                 console.error("Error Code:", potentialEthersError.code);
            }
            // Consider checking for Pinata specific errors if needed
        } else {
            console.error("An unexpected non-Error value was thrown:", error);
        }
    }
}
