var User = artifacts.require("User.sol");
var Meme = artifacts.require("Meme.sol");
var PepeCoin = artifacts.require("PepeCoin.sol");
var MemeketPlace = artifacts.require("MemeketPlace.sol");

contract("MemeketPlace.sol", function (accounts) {
  let userInstance;
  let memeInstance;
  let pepeCoinInstance;
  let memeketPlaceInstance;
  let likeMemeReward = 1;
  let createMemeReward = 50;
  let createUserReward = 100;
  let memeDate = Math.floor(new Date().getTime() / 1000);
  let memeOwner1 = accounts[1];
  let memeOwner2 = accounts[2];
  let memeOwner3 = accounts[3];

  let meme1Path = "PATH TO SU";
  let meme1Title = "PEPE IS KING";
  let meme1Desc = "ALL HAIL PEPE THE GREAT";
  let meme1Id = 0; // meme contract, id starts from 0

  let liker1 = accounts[2];
  let hater1 = accounts[3];

  before(async () => {
    pepeCoinInstance = await PepeCoin.deployed();
    memeketPlaceInstance = await MemeketPlace.deployed();
  });

  it("Should successfully deploy MemeketPlace instance", async () => {
    assert.notEqual(memeketPlaceInstance.address, 0x0);
    assert.notEqual(memeketPlaceInstance.address, null);
    assert.notEqual(memeketPlaceInstance.address, undefined);
    assert.notEqual(memeketPlaceInstance.address, "");
    assert.notEqual(memeketPlaceInstance.address, " ");
  });

  it("Should create user 1, user 2, user 3", async () => {
    let createUser1 = await memeketPlaceInstance.createUser(
      memeOwner1,
      "Random About",
      "Random Hash",
      "Random Display Name",
      "Random Website"
    );
    let createUser2 = await memeketPlaceInstance.createUser(
      memeOwner2,
      "Random About",
      "Random Hash",
      "Random Display Name",
      "Random Website"
    );
    let createUser3 = await memeketPlaceInstance.createUser(
      memeOwner3,
      "Random About",
      "Random Hash",
      "Random Display Name",
      "Random Website"
    );
  });

  it("Should activate user 1, user 2, user 3", async () => {
    let activateUser1 = await memeketPlaceInstance.activateUser(memeOwner1);
    let activateUser2 = await memeketPlaceInstance.activateUser(memeOwner2);
    let activateUser3 = await memeketPlaceInstance.activateUser(memeOwner3);
  });

  it("User 1 should have default created user pepecoins", async () => {
    let numberOfPepeCoinsUser1 = await pepeCoinInstance.balanceOf(memeOwner1);
    assert.strictEqual(
      numberOfPepeCoinsUser1.toNumber(),
      createUserReward,
      "User 1 should have 100 Pepe Coins"
    );
  });

  it("Should upload meme", async () => {
    try {
      await memeketPlaceInstance.uploadMeme(
        memeOwner1,
        memeDate,
        meme1Path,
        meme1Title,
        meme1Desc
      );
    } catch (error) {
      assert.fail("Error encounterd in uploading meme");
    }
    let likeStatus = await memeketPlaceInstance.getLikes(meme1Id, liker1);
    assert.strictEqual(
      likeStatus.toNumber(),
      0,
      "Should return 0 but got " + likeStatus
    );
  });

  it("Should like meme and reward Meme owner", async () => {
    let numberOfPepeCoinsUser1 = await pepeCoinInstance.balanceOf(memeOwner1);
    try {
      await memeketPlaceInstance.likeMeme(meme1Id, { from: liker1 });
    } catch (error) {
      assert.fail("Error encounterd in liking meme");
    }
    let likeStatus = await memeketPlaceInstance.getLikes(meme1Id, liker1);
    assert.strictEqual(
      likeStatus.toNumber(),
      1,
      "Should return 1 but got " + likeStatus
    );
    let numberOfPepeCoinsUser1After = await pepeCoinInstance.balanceOf(
      memeOwner1
    );

    assert.strictEqual(
      numberOfPepeCoinsUser1.toNumber() + likeMemeReward,
      numberOfPepeCoinsUser1After.toNumber(),
      "Should return 11 but got " + numberOfPepeCoinsUser1After.toNumber()
    );
  });

  it("Should unlike meme if likeMeme is called again", async () => {
    try {
      await memeketPlaceInstance.likeMeme(meme1Id, { from: liker1 });
    } catch (error) {
      assert.fail("Error encounterd in unliking meme");
    }
    let likeStatus = await memeketPlaceInstance.getLikes(meme1Id, liker1);
    assert.strictEqual(
      likeStatus.toNumber(),
      0,
      "Should return 0 but got " + likeStatus
    );
  });

  it("Should dislike meme", async () => {
    try {
      await memeketPlaceInstance.dislikeMeme(meme1Id, { from: hater1 });
    } catch (error) {
      assert.fail("Error encounterd in disliking meme");
    }
    let likeStatus = await memeketPlaceInstance.getLikes(meme1Id, hater1);
    assert.strictEqual(
      likeStatus.toNumber(),
      2,
      "Should return 0 but got " + likeStatus
    );
  });

  it("Should un-dislike meme if dislikeMeme is called again", async () => {
    try {
      await memeketPlaceInstance.dislikeMeme(meme1Id, { from: hater1 });
    } catch (error) {
      assert.fail("Error encounterd in disliking meme");
    }
    let likeStatus = await memeketPlaceInstance.getLikes(meme1Id, hater1);
    assert.strictEqual(
      likeStatus.toNumber(),
      0,
      "Should return 0 but got " + likeStatus
    );
  });

  it("likeMeme to overwrite dislikeMeme if its called after dislikeMeme", async () => {
    await memeketPlaceInstance.dislikeMeme(meme1Id, { from: hater1 });
    let likeStatus = await memeketPlaceInstance.getLikes(meme1Id, hater1);
    assert.strictEqual(
      likeStatus.toNumber(),
      2,
      "Should return 2 but got " + likeStatus
    );

    await memeketPlaceInstance.likeMeme(meme1Id, { from: hater1 });
    likeStatus = await memeketPlaceInstance.getLikes(meme1Id, hater1);
    assert.strictEqual(
      likeStatus.toNumber(),
      1,
      "Should return 1 but got " + likeStatus
    );
  });

  it("Should flag Meme", async () => {
    try {
      await memeketPlaceInstance.flagMeme(meme1Id, { from: hater1 });
    } catch (error) {
      assert.fail("Error encounterd in flagging meme");
    }
  });

  it("Should not flag Meme twice", async () => {
    let result = true;
    try {
      await memeketPlaceInstance.flagMeme(meme1Id, { from: hater1 });
      result = false;
    } catch (error) {
      result = true;
    }
    assert.strictEqual(result, true, "User can flag meme twice");
  });
});
