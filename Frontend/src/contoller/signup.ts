// signup.ts
// Note: For full type safety, the imported modules ('../funs', '../utils', '../contract/userMaps')
// should also ideally be TypeScript or have corresponding type definition (.d.ts) files.
// Without them, TypeScript will often infer 'any' for their return types.
// We'll assume the return types based on usage for this conversion.

import { dbPost, signUp, sendMail, retrieveUser, retrieveMsg } from '../funs';
import { generateKeyPair, encryptData, decryptData, hashPassword, encryptPrivateKey, decryptPrivateKey } from '../utils';
import { createUser, addOutbox, addMessage, retrieveUserCID, retrieveMessages, retrieveOutbox, retrievePublicKey } from '../contract/userMaps';
// import {ethers} from 'ethers'; // Not directly used here
// import dotenv from 'dotenv';

// Load environment variables
// dotenv.config();

// Define the expected return type from generateKeyPair (adjust if different)
interface KeyPair {
    publicKey: string;
    privateKey: string;
}

// Wrap your main logic in an async function with typed arguments and return type
export async function runSignup(username: string, password: string): Promise<void> { // Return Promise<void> as it doesn't return a value

    console.log(`Signing up user: ${username}`);

    try {
        // Explicitly type the result of generateKeyPair
        const { publicKey, privateKey }: KeyPair = generateKeyPair();
        console.log("Key pair generated.");

        // Type variables explicitly (though TypeScript might infer string here)
        const hashPass: string = hashPassword(password);
        console.log("Password hashed.");

        const encryptedPrivateKey: string = encryptPrivateKey(privateKey, hashPass);
        console.log("Private key encrypted.");

        // Awaiting returns the resolved value; type the variable holding the result
        // Assuming signUp returns a Promise<string> (the CID)
        const userDetailCID: string = await signUp(username, hashPass, publicKey, encryptedPrivateKey);
        console.log(`User details stored on IPFS. CID: ${userDetailCID}`);

        // Call the smart contract
        // Assuming createUser returns a Promise<string> (the success message)
        const creationResult: string = await createUser(username, userDetailCID, hashPass, publicKey);
        console.log("Contract interaction result:", creationResult);

    } catch (error: unknown) { // Use 'unknown' for type safety in catch blocks
        console.error("Signup process failed:");
        if (error instanceof Error) {
            console.error("Error message:", error.message);
            // Check for specific properties common in ethers.js errors
            // Using 'as any' can bypass type checking, use specific checks if possible
            const potentialEthersError = error as any;
            if (potentialEthersError.reason) {
                console.error("Contract Revert Reason:", potentialEthersError.reason);
            }
            if (potentialEthersError.code) {
                 console.error("Error Code:", potentialEthersError.code);
            }
             // console.error("Stack:", error.stack); // Uncomment for full stack trace
        } else {
            // Handle cases where the thrown value might not be an Error object
            console.error("An unexpected non-Error value was thrown:", error);
        }
    }
}

// --- Execution ---
// The original call `runSignup()` will now cause a TypeScript error because
// the function requires arguments. Provide example arguments or implement
// command-line argument parsing.

// Example using placeholder values:
// const exampleUsername = 'testUserTS' + Date.now(); // Make username unique for testing
// const examplePassword = 'password123TS';

// console.log(`Executing signup for example user: ${exampleUsername}`);

// // Call the async function and handle the promise it returns
// runSignup(exampleUsername, examplePassword)
//     .then(() => {
//         console.log("Signup script execution finished.");
//         // You might want to exit the process cleanly if this is the end of the script
//         // process.exit(0);
//     })
//     .catch((err) => {
//         // This secondary catch handles errors thrown *outside* the try/catch
//         // block within runSignup, or if runSignup itself re-throws an error.
//         console.error("Critical error during signup script execution:", err);
//         // process.exit(1); // Exit with an error code
//     });