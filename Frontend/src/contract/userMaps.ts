// contract/userMaps.ts

// import dotenv from 'dotenv';
import * as ethers from 'ethers';
import contractArtifact from './userMapsABI.json';
// dotenv.config({
//     './'
// });

// const { default: contractArtifact } = await import('./userMapsABI.json', { with: { type: "json" } });

const PRIVATE_KEY: string = "0xecc77ccbfb9ae9aaca37b2a6a9940750056fcf156a35cf8e5b6533d01011e95f";
const PINATA_API_KEY: string = '0dfaba18f13392659c8f';
const PINATA_API_SECRET: string = 'b851ef1ad9a5765beed92370b452085ac5e5bbaa7bfb3849082a6cb576513214';
const CONTRACT_ADDRESS: string = '0x26A8921b07e6A50f9D7417D3Bd1B33d4B1538475';
const RPC_URL: string = 'https://eth-sepolia.g.alchemy.com/v2/BxzYmU-8xP1gehpFVNVQZpdV9Xf41IOp';
const PUBLIC_KEY: string = '0xBCa1f784838dE5BCcd4fc9Fefda8B9FA5590427c';

// Set up provider and signer
const provider: ethers.JsonRpcProvider = new ethers.JsonRpcProvider(RPC_URL);
const signer: ethers.Wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract: ethers.Contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    contractArtifact.abi,
    signer
);

export async function createUser(username: string, profileCID: string, passHash: string, publicKey: string): Promise<string> {
    try {
        console.log(`Creating user ${username} on contract ${CONTRACT_ADDRESS}...`);
        const tx = await contract.createUser(username, profileCID, passHash, publicKey);
        console.log("Transaction sent:", tx.hash);
        await tx.wait();
        console.log("Transaction confirmed.");
        return "User created successfully.";
    } catch (error: any) {
        console.error("Error calling createUser contract function:", error);
        if (error.reason) {
            throw new Error(`Contract call failed: ${error.reason}`);
        }
        throw error;
    }
}

export async function addOutbox(username: string, messageCID: string): Promise<string> {
    try {
        const tx = await contract.addOutbox(username, messageCID);
        await tx.wait();
        return "Outbox message added.";
    } catch (error: any) {
        console.error("Error calling addOutbox contract function:", error);
        if (error.reason) {
            throw new Error(`Contract call failed: ${error.reason}`);
        }
        throw error;
    }
}

export async function addMessage(username: string, messageCID: string): Promise<string> {
    try {
        const tx = await contract.addMessage(username, messageCID);
        await tx.wait();
        return "Message added.";
    } catch (error: any) {
        console.error("Error calling addMessage contract function:", error);
        if (error.reason) {
            throw new Error(`Contract call failed: ${error.reason}`);
        }
        throw error;
    }
}

export async function retrieveUserCID(username: string, passHash: string): Promise<any> {
    try {
        return await contract.retrieveUserCID(username, passHash);
    } catch (error: any) {
        console.error("Error calling retrieveUserCID contract function:", error);
        if (error.reason) {
            if (error.reason === "User does not exist" || error.reason === "Incorrect Password") {
                throw new Error(error.reason);
            }
            throw new Error(`Contract call failed: ${error.reason}`);
        }
        throw error;
    }
}

export async function retrieveMessages(username: string): Promise<any> {
    try {
        return await contract.retrieveMessages(username);
    } catch (error: any) {
        console.error("Error calling retrieveMessages contract function:", error);
        if (error.reason) {
            if (error.reason === "User does not exist") {
                throw new Error(error.reason);
            }
            throw new Error(`Contract call failed: ${error.reason}`);
        }
        throw error;
    }
}

export async function retrieveOutbox(username: string): Promise<any> {
    try {
        return await contract.retrieveOutbox(username);
    } catch (error: any) {
        console.error("Error calling retrieveOutbox contract function:", error);
        if (error.reason) {
            if (error.reason === "User does not exist") {
                throw new Error(error.reason);
            }
            throw new Error(`Contract call failed: ${error.reason}`);
        }
        throw error;
    }
}

export async function retrievePublicKey(username: string): Promise<any> {
    try {
        return await contract.retrievePublicKey(username);
    } catch (error: any) {
        console.error("Error calling retrievePublicKey contract function:", error);
        if (error.reason) {
            if (error.reason === "User does not exist") {
                throw new Error(error.reason);
            }
            throw new Error(`Contract call failed: ${error.reason}`);
        }
        throw error;
    }
}