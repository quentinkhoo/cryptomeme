var User = artifacts.require("User.sol");

contract("User.sol", function (accounts) {
  let userInstance;
  let memeOwner0 = accounts[0];
  let memeOwner1 = accounts[1];
  let memeOwner2 = accounts[2];
  let memeOwner3 = accounts[3];

  before(async () => {
    userInstance = await User.deployed();
  });

  it("Should successfully deploy user instance", async () => {
    assert.notEqual(userInstance.address, 0x0);
    assert.notEqual(userInstance.address, null);
    assert.notEqual(userInstance.address, undefined);
    assert.notEqual(userInstance.address, "");
    assert.notEqual(userInstance.address, " ");
  });

  it("Should have already added one (admin) user and return it", async () => {
    let res1 = await userInstance.users.call(0);
    let address1 = await userInstance.getUserAddress(0);
    assert.strictEqual(
      address1.toString(),
      memeOwner0,
      "User Address should be contract owner address"
    );
    assert.strictEqual(res1.userId.toNumber(), 0, "Should userId equal to 0");
  });

  it("Should activate user", async () => {
    await userInstance.createUser(
      memeOwner1,
      "_about",
      "_displayPictureHash",
      "_displayName",
      "_website"
    );

    let isActive1 = await userInstance.checkUserIsActive(memeOwner1);
    await userInstance.setUserAsActive(memeOwner1);
    let isActive2 = await userInstance.checkUserIsActive(memeOwner1);
    assert.strictEqual(isActive1.toString(), "false", "Should be false");
    assert.strictEqual(isActive2.toString(), "true", "Should be true");
  });
});
