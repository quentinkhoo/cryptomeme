pragma solidity ^0.5.0;
import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./User.sol";


contract PepeCoin is ERC20 {
    using SafeMath for uint256;
    address contractOwner = msg.sender;
    User userContract;

    constructor(User _userContract) public {
        userContract = _userContract;
    }

    function mintPepeCoins(address _address, uint256 _amountToMint) public {
        require(
            userContract.checkUserIsAdmin(tx.origin),
            "You're not an admin!"
        );
        _mint(_address, _amountToMint);
    }

    function transferPepeCoins(
        address _sender,
        address _receiver,
        uint256 amount
    ) public {
        require(_sender == tx.origin, "You're not the sender for some reason");
        _transfer(_sender, _receiver, amount);
    }
}
