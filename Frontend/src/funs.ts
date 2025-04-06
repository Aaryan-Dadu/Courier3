// funs.ts

// import dotenv from 'dotenv';
// dotenv.config(); // Load environment variables

// Retrieve Pinata keys from environment variables - Keeping this practice
const PINATA_API_KEY = '0dfaba18f13392659c8f';
const PINATA_API_SECRET = 'b851ef1ad9a5765beed92370b452085ac5e5bbaa7bfb3849082a6cb576513214' ;

// Check if keys are loaded
if (!PINATA_API_KEY || !PINATA_API_SECRET) {
    // Throw an error if keys are missing to prevent runtime failures
    throw new Error("Pinata API Key or Secret Key not found in environment variables. Please check your .env file.");
}

// Interface for the expected structure of the Pinata API success response
interface PinataSuccessResponse {
    IpfsHash: string; // Required on success
    PinSize?: number;
    Timestamp?: string;
}

// Interface for Pinata error response structure (adjust based on actual errors)
interface PinataErrorResponse {
    error?: {
        reason?: string;
        details?: string;
    } | string; // Error might be an object or just a string
}

// Combine success and potential error structures
type PinataResponse = PinataSuccessResponse | PinataErrorResponse;

// Interface for the data object passed to dbPost
interface DbPostData {
  [key: string]: any; // Allows any string key with any value type
}


export async function dbPost(data: DbPostData): Promise<string> {
    const url: string = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

    // Use the built-in RequestInit type for fetch options
    const options: RequestInit = {
        method: 'POST',
        headers: { // This object literal is compatible with Record<string, string>
            'Content-Type': 'application/json',
            'pinata_api_key': PINATA_API_KEY, // Use loaded keys
            'pinata_secret_api_key': PINATA_API_SECRET, // Use loaded keys
        },
        body: JSON.stringify(data),
    };

    try {
        const response: Response = await fetch(url, options); // fetch expects RequestInit

        const result: PinataResponse = await response.json(); // Parse JSON regardless of status first

        // Check response status *after* parsing, as Pinata might return error details in JSON
        if (!response.ok) {
            let errorDetails = `HTTP error! Status: ${response.status}`;
            // Try to extract error details from parsed JSON
             if (typeof result === 'object' && result && 'error' in result) {
                 const errorContent = (result as PinataErrorResponse).error;
                 errorDetails += ` - ${JSON.stringify(errorContent)}`;
             }
            throw new Error(errorDetails);
        }


        console.log('Pinata response:', result);

        // Type guard to check if the result has IpfsHash after confirming response.ok
        if ('IpfsHash' in result && result.IpfsHash) {
            return result.IpfsHash;
        } else {
            // This case should ideally be caught by !response.ok, but added as a fallback
             const errorMessage = typeof result === 'object' && result && 'error' in result
                ? JSON.stringify((result as PinataErrorResponse).error)
                : 'No IpfsHash returned from Pinata despite OK status.';
            throw new Error(errorMessage);
        }
    } catch (error: unknown) {
        console.error('Error during Pinata interaction:');
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error("An unexpected non-Error value was thrown:", error);
        }
        // Re-throw the original error or a new one to signal failure
        throw error;
    }
}

// Define interface for signup data stored on IPFS
interface SignUpIpfsData {
    username: string;
    password?: string; // This should ideally be the HASHED password
    publicKey: string;
    privateKey: string; // This should be the *ENCRYPTED* private key
}

export async function signUp(username: string, passHash: string, publicKey: string, encryptedPrivateKey: string): Promise<string> {
    // Use interface matching the data being stored
    const data: SignUpIpfsData = {
        username,
        password: passHash, // Storing the hash
        publicKey,
        privateKey: encryptedPrivateKey // Storing the encrypted key
    };
    const cid: string = await dbPost(data);
    console.log('Signup CID:', cid);
    return cid;
}

// Define interface for mail data stored on IPFS
interface MailIpfsData {
    to: string;
    from: string;
    subject: string; // This will be the ENCRYPTED subject
    body: string;    // This will be the ENCRYPTED body
    timestamp: string;
}

export async function sendMail(to: string, from: string, subject: string, body: string, timestamp: string): Promise<string> {
    const data: MailIpfsData = { to, from, subject, body, timestamp };
    const cid: string = await dbPost(data);
    console.log('Mail CID:', cid);
    return cid;
}

// Define a more specific type for the expected user data retrieved from IPFS
// Should match SignUpIpfsData. Using 'any' is less type-safe.
type RetrievedUserData = SignUpIpfsData | { [key: string]: any }; // Allow flexible object or specific type

export async function retrieveUser(cid: string): Promise<RetrievedUserData> {
    if (!cid || typeof cid !== 'string' || cid.length < 46) {
         throw new Error(`Invalid CID format provided for retrieveUser: ${cid}`);
    }
    const url: string = `https://gateway.pinata.cloud/ipfs/${cid}`; // Consider making the gateway configurable
    console.log(`Retrieving user data from: ${url}`);
    try {
        const response: Response = await fetch(url);
        if (!response.ok) {
             throw new Error(`Failed to retrieve user data from IPFS. Status: ${response.status} for CID: ${cid}`);
         }
        // Consider adding validation here to ensure the returned data matches expected structure
        const data: RetrievedUserData = await response.json();
        console.log('Retrieved User:', data);
        return data;
    } catch (error: unknown) {
        console.error(`Error retrieving user data from IPFS (CID: ${cid}):`);
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error(error);
        }
        throw error;
    }
}

// Define a more specific type for the retrieved message data
// Should match MailIpfsData.
type RetrievedMessageData = MailIpfsData | { [key: string]: any };

export async function retrieveMsg(cid: string): Promise<RetrievedMessageData> {
     if (!cid || typeof cid !== 'string' || cid.length < 46) {
         throw new Error(`Invalid CID format provided for retrieveMsg: ${cid}`);
    }
    const url: string = `https://gateway.pinata.cloud/ipfs/${cid}`;
    console.log(`Retrieving message data from: ${url}`);
    try {
        const response: Response = await fetch(url);
        if (!response.ok) {
             throw new Error(`Failed to retrieve message data from IPFS. Status: ${response.status} for CID: ${cid}`);
         }
         // Consider adding validation here
        const data: RetrievedMessageData = await response.json();
        console.log('Retrieved Message:', data);
        return data;
    } catch (error: unknown) {
        console.error(`Error retrieving message data from IPFS (CID: ${cid}):`);
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error(error);
        }
        throw error;
    }
}

// IIFE remains commented
/* ... */