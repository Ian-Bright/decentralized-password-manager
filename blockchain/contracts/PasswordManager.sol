pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;

contract PasswordManager {

    // Owner of the contract
    address public owner;

    // Map users by address to their object
    mapping(address => User) internal users;

    // Create a struct to represent a user and their passwords
    struct User {
        string[] serviceArray;
        mapping(string => string) passwords;
        mapping(string => uint) serviceToIndex;
    }

    // Events
    event LogServiceAdded(address user);
    event LogPasswordChanged(address user);
    event LogServiceRemoved(address user);

    // Functions
    constructor() public {
        owner = msg.sender;
    }

    /* Add a service with a respective password and store it in the User struct*/
    function addService(string memory _service, string memory _password) public returns(bool) {
        users[msg.sender].serviceToIndex[_service] = users[msg.sender].serviceArray.length;
        users[msg.sender].serviceArray.push(_service);
        users[msg.sender].passwords[_service] = _password;
        emit LogServiceAdded(msg.sender);
        return true;
    }

    /* Change password for an existing service by supplying a new password */
    function changePassword(string memory _service, string memory _newPassword) public returns(bool) {
        users[msg.sender].passwords[_service] = _newPassword;
        emit LogPasswordChanged(msg.sender);
        return true;
    }

    /* Remove a service from the list of the sender's services */
    function removeService(string memory _service) public returns(bool) {
        require(users[msg.sender].serviceArray.length > 0, "Array is empty");
        uint index = users[msg.sender].serviceToIndex[_service];
        if(users[msg.sender].serviceArray.length > 1) {
            users[msg.sender].serviceArray[index] =  users[msg.sender].serviceArray[users[msg.sender].serviceArray.length - 1];
        }
        users[msg.sender].serviceArray.length--;
        emit LogServiceRemoved(msg.sender);
        return true;
    }

    /* Return all services based on the current sender */
    function returnServices() public view returns(string[] memory) {
        return users[msg.sender].serviceArray;
    }

    /* Retrieve password for the respective service provided */
    function retrievePassword(string memory _service) public view returns(string memory) {
        return users[msg.sender].passwords[_service];
    }

}
