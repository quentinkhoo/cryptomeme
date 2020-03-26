pragma solidity ^0.5.0;
import "../node_modules/@openzeppelin/contracts/math/SafeMath.sol";

contract User {
    /*
    modifier adminOnly() {
        require(msg.sender == admin, "Restricted to admin only");
        _;
    }
    
    // modifier contentCreatorOnly () {
    //     require(registered_Users[traceUser[msg.owner]].role == userRole.contentCreator, "Restricted to Content Creators only");
    //     _;
    // }

    // modifier moderatorOnly () {
    //     require(registered_Users[traceUser[msg.owner]].role == userRole.moderator, "Restricted to moderator only");
    //     _;
    // }

    
    modifier registeredUsersOnly() {
        require(
            registered_Users[msg.sender].state == userStates.registered,
            "Restricted to registered users only"
        );
        _;
    }

    modifier specificUserOnly(address userAd) {
        require(msg.sender == userAd, "Restricted to user only");
        _;
    }

    modifier alreadyFollowed(address userAd) {
        require(
            alreadyFollowing[msg.sender][userAd] == true,
            "User already followed"
        );
        _;
    }
    */
    using SafeMath for uint256;
    address admin = msg.sender;

    enum userStates {pending, active, deactivated, admin}

    uint256 public numberOfUsers = 0;

    struct User {
        uint256 userId;
        address userWallet;
        string username;
        string about;
        string displayPictureHash;
        string displayName;
        string website;
        userStates state;
    }

    User[] public users;
    mapping(address => bool) userExists;
    mapping(address => uint256) userIds;

    event UserCreated(
        uint256 userId,
        address userWallet,
        string username,
        string about,
        string displayPictureHash,
        string displayName,
        string website
    );
    event UsernameChanged(address userWallet, string username);
    event UserAboutChanged(address userWallet, string about);
    event UserDisplayPictureChanged(
        address userWallet,
        string displayPictureHash
    );
    event UserDisplayNameChanged(address userWallet, string displayName);
    event UserWebsiteChanged(address userWallet, string website);
    event UserActivated(address userWallet);
    event UserDeactivated(address userWallet);

    constructor() public {
        //Create admin user
        createUser(
            msg.sender,
            "administrator",
            "I am the boss",
            "QmP1KdPrFV9wKbDy5WvCDKd3YcyTBbFvqfvBCzjGrDiVLZ",
            "BigPepeBoss",
            "www.4chan.org"
        );
        users[userIds[msg.sender]].state = userStates.admin;
    }

    function createUser(
        address _userWallet,
        string memory _username,
        string memory _about,
        string memory _displayPictureHash,
        string memory _displayName,
        string memory _website
    ) public {
        User memory newUser = User(
            numberOfUsers,
            _userWallet,
            _username,
            _about,
            _displayPictureHash,
            _displayName,
            _website,
            userStates.pending
        );
        users.push(newUser);
        emit UserCreated(
            numberOfUsers,
            _userWallet,
            _username,
            _about,
            _displayPictureHash,
            _displayName,
            _website
        );
        userExists[_userWallet] = true;
        userIds[_userWallet] = numberOfUsers;
        numberOfUsers = numberOfUsers.add(1);
    }

    function setUsername(address _userWallet, string memory _username) public {
        users[userIds[_userWallet]].username = _username;
        emit UsernameChanged(_userWallet, _username);
    }

    function setUserAbout(address _userWallet, string memory _about) public {
        users[userIds[_userWallet]].about = _about;
        emit UserAboutChanged(_userWallet, _about);
    }

    function setUserDisplayPicture(
        address _userWallet,
        string memory _displayPictureHash
    ) public {
        users[userIds[_userWallet]].displayPictureHash = _displayPictureHash;
        emit UserDisplayPictureChanged(_userWallet, _displayPictureHash);
    }

    function setUserDisplayName(address _userWallet, string memory _displayName)
        public
    {
        users[userIds[_userWallet]].displayName = _displayName;
        emit UserDisplayNameChanged(_userWallet, _displayName);
    }

    function setUserWebsite(address _userWallet, string memory _website)
        public
    {
        users[userIds[_userWallet]].website = _website;
        emit UserWebsiteChanged(_userWallet, _website);
    }

    function setUserAsDeactivated(address _userWallet) public {
        users[userIds[_userWallet]].state = userStates.deactivated;
        emit UserDeactivated(_userWallet);
    }

    function setUserAsActive(address _userWallet) public {
        users[userIds[_userWallet]].state = userStates.active;
        emit UserActivated(_userWallet);
    }

    function checkUserExists(address _userWallet) public view returns (bool) {
        return userExists[_userWallet];
    }

    /*
    function getUserRole(address userAd) public view returns (string memory) {
        return getRoleKeyByValue(registered_Users[userAd].role);
    }

    function getRoleKeyByValue(userRoles r)
        internal
        pure
        returns (string memory)
    {
        // Error handling for input
        require(uint8(r) <= 3);

        // Loop through possible options
        if (userRoles.viewer == r) return "viewer";
        if (userRoles.contentCreator == r) return "contentCreator";
        if (userRoles.moderator == r) return "moderator";
    }
    

    function getUserStatus(address userAd) public view returns (string memory) {
        return getStatusKeyByValue(registered_Users[userAd].state);
    }

    function getStatusKeyByValue(userStates s)
        internal
        pure
        returns (string memory)
    {
        // Error handling for input
        require(uint8(s) <= 2);

        // Loop through possible options
        if (userStates.unregistered == s) return "unregistered";
        if (userStates.registered == s) return "registered";
    }

    function followUser(address userAd)
        public
        registeredUsersOnly
        alreadyFollowed(userAd)
    {
        alreadyFollowing[msg.sender][userAd] = true;
        following[msg.sender].push(userAd);
    }

    function getUserFollowing(address userAd)
        public
        view
        returns (address[] memory)
    {
        return following[userAd];
    }
    */

}
