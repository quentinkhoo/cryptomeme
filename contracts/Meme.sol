pragma solidity ^0.5.0;
import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Meme is ERC721 {
    using SafeMath for uint256;

    address contractOwner = msg.sender;

    uint256 public numberOfMemes = 0;

    enum memeStates {approved, rejected, pending}

    struct meme {
        address memeOwner;
        uint256 memeId;
        uint256 memeLikes;
        uint256 memeDislikes;
        uint256 memeFlags;
        uint256 memeValue;
        string memePath;
        string memeTitle;
        string memeDescription;
        memeStates memeState;
    }

    meme[] public memes;

    event MemeCreated(
        uint256 memeId,
        string memePath,
        string memeTitle,
        string memeDescription
    );
    event MemeLiked(uint256 memeId, uint256 memeLikes);
    event MemeDisliked(uint256 memeId, uint256 memeDislikes);
    event MemeFlagged(uint256 memeId, uint256 memeFlags);
    event MemeApproved(uint256 memeId);
    event MemeRejected(uint256 memeId);
    event MemeValueChanged(uint256 memeId, uint256 memeValue);
    event MemePathChanged(uint256 memeId, string memePath);
    event MemeTitleChanged(uint256 memeId, string memeTitle);
    event MemeDescriptionChanged(uint256 memeId, string memeDescription);

    function createMeme(
        address _memeOwner,
        string memory _memePath,
        string memory _memeTitle,
        string memory _memeDescription
    ) public returns (uint256) {
        meme memory _meme = meme(
            _memeOwner,
            numberOfMemes,
            0,
            0,
            0,
            0,
            _memePath,
            _memeTitle,
            _memeDescription,
            memeStates.pending
        );
        uint256 _memeId = memes.push(_meme).sub(1);
        _mint(_memeOwner, _memeId);
        numberOfMemes = numberOfMemes.add(1);
        emit MemeCreated(_memeId, _memePath, _memeTitle, _memeDescription);
        return _memeId;
    }

    function getMemeOwner(uint256 _memeId) public view returns (address){
        return memes[_memeId].memeOwner;
    }

    function getMemeLikes(uint256 _memeId) public view returns (uint256) {
        return memes[_memeId].memeLikes;
    }

    function getMemeDislikes(uint256 _memeId) public view returns (uint256) {
        return memes[_memeId].memeDislikes;
    }

    function getMemeFlags(uint256 _memeId) public view returns (uint256) {
        return memes[_memeId].memeFlags;
    }

    function getMemeValue(uint256 _memeId) public view returns (uint256) {
        return memes[_memeId].memeValue;
    }

    function getMemeState(uint256 _memeId) public view returns (memeStates) {
        return memes[_memeId].memeState;
    }

    function getMemePath(uint256 _memeId) public view returns (string memory) {
        return memes[_memeId].memePath;
    }

    function getMemeTitle(uint256 _memeId) public view returns (string memory) {
        return memes[_memeId].memeTitle;
    }

    function getMemeDescription(uint256 _memeId)
        public
        view
        returns (string memory)
    {
        return memes[_memeId].memeDescription;
    }

    function setMemeLikes(uint256 _memeId, uint256 _memeLikes) public {
        memes[_memeId].memeLikes = _memeLikes;
        emit MemeLiked(_memeId, _memeLikes);
    }

    function setMemeDislikes(uint256 _memeId, uint256 _memeDislikes) public {
        memes[_memeId].memeDislikes = _memeDislikes;
        emit MemeDisliked(_memeId, _memeDislikes);
    }

    function setMemeFlags(uint256 _memeId, uint256 _memeFlags) public {
        memes[_memeId].memeFlags = _memeFlags;
        emit MemeFlagged(_memeId, _memeFlags);
    }

    function setMemeValue(uint256 _memeId, uint256 _memeValue) public {
        memes[_memeId].memeValue = _memeValue;
        emit MemeValueChanged(_memeId, _memeValue);
    }

    function approveMeme(uint256 _memeId) public {
        memes[_memeId].memeState = memeStates.approved;
        emit MemeApproved(_memeId);
    }

    function rejectMeme(uint256 _memeId) public {
        memes[_memeId].memeState = memeStates.rejected;
        emit MemeRejected(_memeId);
    }

    function setMemePath(uint256 _memeId, string memory _memePath) public {
        memes[_memeId].memePath = _memePath;
        emit MemePathChanged(_memeId, _memePath);
    }

    function setMemeTitle(uint256 _memeId, string memory _memeTitle) public {
        memes[_memeId].memeTitle = _memeTitle;
        emit MemeTitleChanged(_memeId, _memeTitle);
    }
    
    function setMemeDescription(uint256 _memeId, string memory _memeDescription)
        public
    {
        memes[_memeId].memeDescription = _memeDescription;
        emit MemeDescriptionChanged(_memeId, _memeDescription);
    }

}
