var Meme = artifacts.require("Meme.sol");

contract("Meme.sol", function (accounts) {
  let memeInstance;
  let memeOwner1 = accounts[1];
  let memeOwner2 = accounts[2];
  let memeOwner3 = accounts[3];
  let meme1Path = "/path/meme/1";
  let meme2Path = "/path/meme/2";
  let meme3Path = "/path/meme/3";
  let memeDate = Math.floor(new Date().getTime() / 1000);
  let memeNewDate = Math.floor(new Date().getTime() / 1000);
  let meme1Title = "Meme 1";
  let meme2Title = "Meme 2";
  let meme3Title = "Meme 3";
  let meme1Description = "This is Meme 1";
  let meme2Description = "This is Meme 2";
  let meme3Description = "This is Meme 3";
  let approved = 0;
  let rejected = 1;
  let pending = 2;

  before(async () => {
    memeInstance = await Meme.deployed();
  });

  it("Should successfully deploy meme instance", async () => {
    assert.notEqual(memeInstance.address, 0x0);
    assert.notEqual(memeInstance.address, null);
    assert.notEqual(memeInstance.address, undefined);
    assert.notEqual(memeInstance.address, "");
    assert.notEqual(memeInstance.address, " ");
  });

  it("Should create 3 memes properly", async () => {
    let meme1Result = await memeInstance.createMeme(
      memeOwner1,
      memeDate,
      meme1Path,
      meme1Title,
      meme1Description
    );
    let meme2Result = await memeInstance.createMeme(
      memeOwner2,
      memeDate,
      meme2Path,
      meme2Title,
      meme2Description
    );
    let meme3Result = await memeInstance.createMeme(
      memeOwner3,
      memeDate,
      meme3Path,
      meme3Title,
      meme3Description
    );

    //Meme 1
    assert.strictEqual(
      meme1Result.logs[1].event,
      "MemeCreated",
      "Should create meme 1"
    );

    assert.strictEqual(
      meme1Result.logs[1].args[0].toNumber(),
      0,
      "Should return meme ID 0"
    );

    assert.strictEqual(
      meme1Result.logs[1].args[2],
      meme1Path,
      "Should return meme path 1"
    );

    assert.strictEqual(
      meme1Result.logs[1].args[3],
      meme1Title,
      "Should return meme title 1"
    );

    assert.strictEqual(
      meme1Result.logs[1].args[4],
      meme1Description,
      "Should return meme description 1"
    );

    //Meme 2
    assert.strictEqual(
      meme2Result.logs[1].event,
      "MemeCreated",
      "Should create meme 2"
    );

    assert.strictEqual(
      meme2Result.logs[1].args[0].toNumber(),
      1,
      "Should return meme ID 1"
    );

    assert.strictEqual(
      meme2Result.logs[1].args[2],
      meme2Path,
      "Should return meme path 2"
    );

    assert.strictEqual(
      meme2Result.logs[1].args[3],
      meme2Title,
      "Should return meme title 2"
    );

    assert.strictEqual(
      meme2Result.logs[1].args[4],
      meme2Description,
      "Should return meme description 2"
    );

    //Meme 3
    assert.strictEqual(
      meme3Result.logs[1].event,
      "MemeCreated",
      "Should create meme 3"
    );

    assert.strictEqual(
      meme3Result.logs[1].args[0].toNumber(),
      2,
      "Should return meme ID 2"
    );

    assert.strictEqual(
      meme3Result.logs[1].args[2],
      meme3Path,
      "Should return meme path 3"
    );

    assert.strictEqual(
      meme3Result.logs[1].args[3],
      meme3Title,
      "Should return meme title 3"
    );

    assert.strictEqual(
      meme3Result.logs[1].args[4],
      meme3Description,
      "Should return meme description 3"
    );

    let numberOfMemes = await memeInstance.numberOfMemes.call();
    assert.strictEqual(
      numberOfMemes.toNumber(),
      3,
      "Number of memes should be 3"
    );
  });

  it("Should show meme states to be pending", async () => {
    let meme1State = await memeInstance.getMemeState.call(0);
    let meme2State = await memeInstance.getMemeState.call(1);
    let meme3State = await memeInstance.getMemeState.call(2);

    assert.strictEqual(
      meme1State.toNumber(),
      pending,
      "Meme 1 should be pending"
    );

    assert.strictEqual(
      meme2State.toNumber(),
      pending,
      "Meme 2 should be pending"
    );

    assert.strictEqual(
      meme3State.toNumber(),
      pending,
      "Meme 3 should be pending"
    );
  });

  it("Should return correct owners for memes", async () => {
    let meme1Owner = await memeInstance.ownerOf.call(0);
    let meme2Owner = await memeInstance.ownerOf.call(1);
    let meme3Owner = await memeInstance.ownerOf.call(2);

    assert.strictEqual(
      meme1Owner,
      memeOwner1,
      "Meme 1 owner should be correct"
    );

    assert.strictEqual(
      meme2Owner,
      memeOwner2,
      "Meme 2 owner should be correct"
    );

    assert.strictEqual(
      meme3Owner,
      memeOwner3,
      "Meme 3 owner should be correct"
    );
  });

  it("Should like meme 1 three times", async () => {
    let setMeme1Likes = await memeInstance.setMemeLikes(0, 3);
    let getMeme1Likes = await memeInstance.getMemeLikes.call(0);

    assert.strictEqual(
      setMeme1Likes.logs[0].event,
      "MemeLiked",
      "MemeLiked event should be emitted"
    );

    assert.strictEqual(
      setMeme1Likes.logs[0].args[1].toNumber(),
      3,
      "Meme 1 should have 3 likes"
    );

    assert.strictEqual(
      getMeme1Likes.toNumber(),
      3,
      "Meme 1 should have 3 likes"
    );
  });

  it("Should dislike meme 1 two times", async () => {
    let setMeme1Dislikes = await memeInstance.setMemeDislikes(0, 2);
    let getMeme1Dislikes = await memeInstance.getMemeDislikes.call(0);

    assert.strictEqual(
      setMeme1Dislikes.logs[0].event,
      "MemeDisliked",
      "MemeDisliked event should be emitted"
    );

    assert.strictEqual(
      setMeme1Dislikes.logs[0].args[1].toNumber(),
      2,
      "Meme 1 should have 2 dislikes"
    );

    assert.strictEqual(
      getMeme1Dislikes.toNumber(),
      2,
      "Meme 1 should have 2 dislikes"
    );
  });

  it("Should change meme path of meme 1", async () => {
    let meme1NewPath = "/newpath/meme/1";
    let setMeme1Path = await memeInstance.setMemePath(0, meme1NewPath);
    let getMeme1Path = await memeInstance.getMemePath(0);

    assert.strictEqual(
      setMeme1Path.logs[0].event,
      "MemePathChanged",
      "MemePathChanged event should be emitted"
    );

    assert.strictEqual(
      setMeme1Path.logs[0].args[1],
      meme1NewPath,
      "Meme1 should have a new path"
    );

    assert.strictEqual(
      getMeme1Path,
      meme1NewPath,
      "Meme 1 should have a new path"
    );
  });

  it("Should change value of meme 2 to 50", async () => {
    let setMeme2Value = await memeInstance.setMemeValue(1, 50);
    let getMeme2Value = await memeInstance.getMemeValue(1);

    assert.strictEqual(
      setMeme2Value.logs[0].event,
      "MemeValueChanged",
      "MemeValueChanged event should be emitted"
    );

    assert.strictEqual(
      setMeme2Value.logs[0].args[1].toNumber(),
      50,
      "Meme2 should have a new value of 50"
    );

    assert.strictEqual(
      getMeme2Value.toNumber(),
      50,
      "Meme 2 should have a new value of 50"
    );
  });

  it("Should approve Meme 2", async () => {
    let approveMeme2 = await memeInstance.approveMeme(1, memeNewDate);
    let getMeme2State = await memeInstance.getMemeState(1);
    assert.strictEqual(
      approveMeme2.logs[0].event,
      "MemeApproved",
      "MemeApproved event should be emitted"
    );

    assert.strictEqual(
      approveMeme2.logs[0].args[0].toNumber(),
      1,
      "Meme 2 ID should be emitted in event"
    );

    assert.strictEqual(
      getMeme2State.toNumber(),
      approved,
      "Meme 2 should be approved"
    );
  });

  it("Should flag Meme 3 one time", async () => {
    let setMeme3Flags = await memeInstance.setMemeFlags(2, 1);
    let getMeme3Flags = await memeInstance.getMemeFlags.call(2);

    assert.strictEqual(
      setMeme3Flags.logs[0].event,
      "MemeFlagged",
      "MemeFlagged event should be emitted"
    );

    assert.strictEqual(
      setMeme3Flags.logs[0].args[1].toNumber(),
      1,
      "Meme 3 should have 1 flag"
    );

    assert.strictEqual(
      getMeme3Flags.toNumber(),
      1,
      "Meme 3 should have 1 flag"
    );
  });

  it("Should reject Meme 3", async () => {
    let rejectMeme3 = await memeInstance.rejectMeme(2, memeNewDate);
    let getMeme3State = await memeInstance.getMemeState.call(2);

    assert.strictEqual(
      rejectMeme3.logs[0].event,
      "MemeRejected",
      "MemeRejected event should be emitted"
    );

    assert.strictEqual(
      rejectMeme3.logs[0].args[0].toNumber(),
      2,
      "Meme3 ID should be emitted in event"
    );

    assert.strictEqual(
      getMeme3State.toNumber(),
      rejected,
      "Meme 3 should be rejected"
    );
  });
});
