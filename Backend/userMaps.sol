// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract userMaps {

    mapping(string => string[]) private userOutbox;

    mapping(string => string) private userProfile;

    mapping(string => string[]) private userMessages;

    mapping(string => bool) private userExists;

    mapping(string => string) private userPassHash;

    mapping(string => string) private userPublicKey;

    /// Create a new user with username and profile CID
    function createUser(string memory username, string memory profileCID, string memory passHash, string memory publicKey) public {
        require(!userExists[username], "User already exists");
        userProfile[username] = profileCID;
        userExists[username] = true;
        userPassHash[username] = passHash;
        userPublicKey[username] = publicKey;
    }

    /// Add a new message CID to the user
    function addOutbox(string memory username, string memory messageCID) public {
        require(userExists[username], "User does not exist");
        userOutbox[username].push(messageCID);
    }

    function addMessage(string memory username, string memory messageCID) public {
        require(userExists[username], "User does not exist");
        userMessages[username].push(messageCID);
    }

    /// Retrieve the user's profile CID
    function retrieveUserCID(string memory username, string memory passHash) public view returns (string memory) {
        require(userExists[username], "User does not exist");
        require(keccak256(abi.encodePacked(userPassHash[username])) == keccak256(abi.encodePacked(passHash)),
    "Incorrect Password"
);
        return userProfile[username];
    }

    /// Retrieve all message CIDs of a user
    function retrieveMessages(string memory username) public view returns (string[] memory) {
        require(userExists[username], "User does not exist");
        return userMessages[username];
    }

    function retrieveOutbox(string memory username) public view returns (string[] memory) {
        require(userExists[username], "User does not exist");
        return userOutbox[username];
    }

    function retrievePublicKey(string memory username) public view returns (string memory) {
        require(userExists[username], "User does not exist");
        return userPublicKey[username];
    }
}
