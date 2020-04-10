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
        uint256 memeDate;
        string memePath;
        string memeTitle;
        string memeDescription;
        memeStates memeState;
    }

    meme[] public memes;

    event MemeCreated(
        uint256 memeId,
        uint256 memeDate,
        string memePath,
        string memeTitle,
        string memeDescription
    );
    event MemeLiked(uint256 memeId, uint256 memeLikes);
    event MemeDisliked(uint256 memeId, uint256 memeDislikes);
    event MemeFlagged(uint256 memeId, uint256 memeFlags);
    event MemeApproved(uint256 memeId, uint256 memeDate);
    event MemeRejected(uint256 memeId, uint256 memeDate);
    event MemeValueChanged(uint256 memeId, uint256 memeValue);
    event MemeDateChanged(uint256 memeId, uint256 memeDate);
    event MemePathChanged(uint256 memeId, string memePath);
    event MemeTitleChanged(uint256 memeId, string memeTitle);
    event MemeDescriptionChanged(uint256 memeId, string memeDescription);

    function createMeme(
        address _memeOwner,
        uint256 _memeDate,
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
            _memeDate,
            _memePath,
            _memeTitle,
            _memeDescription,
            memeStates.pending
        );
        uint256 _memeId = memes.push(_meme).sub(1);
        _mint(_memeOwner, _memeId);
        numberOfMemes = numberOfMemes.add(1);
        emit MemeCreated(
            _memeId,
            _memeDate,
            _memePath,
            _memeTitle,
            _memeDescription
        );
        return _memeId;
    }

    function getNumberMemes() public view returns (uint256) {
        return numberOfMemes;
    }

    function getMemeOwner(uint256 _memeId) public view returns (address) {
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

    function getMemeDate(uint256 _memeId) public view returns (uint256) {
        return memes[_memeId].memeDate;
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

    function approveMeme(uint256 _memeId, uint256 _newDate) public {
        memes[_memeId].memeState = memeStates.approved;
        memes[_memeId].memeDate = _newDate;
        emit MemeApproved(_memeId, _newDate);
    }

    function rejectMeme(uint256 _memeId, uint256 _newDate) public {
        memes[_memeId].memeState = memeStates.rejected;
        memes[_memeId].memeDate = _newDate;
        emit MemeRejected(_memeId, _newDate);
    }

    function setMemeDate(uint256 _memeId, uint256 _memeDate) public {
        memes[_memeId].memeDate = _memeDate;
        emit MemeDateChanged(_memeId, _memeDate);
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
