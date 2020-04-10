var PepeCoin = artifacts.require("PepeCoin.sol");

contract("PepeCoin.sol", function (accounts) {
  let pepeCoinInstance;
  let user1 = accounts[1];
  let mintAmount = 50;

  before(async () => {
    pepeCoinInstance = await PepeCoin.deployed();
  });

  it("Should successfully deploy pepeCoin instance", async () => {
    assert.notEqual(pepeCoinInstance.address, 0x0);
    assert.notEqual(pepeCoinInstance.address, null);
    assert.notEqual(pepeCoinInstance.address, undefined);
    assert.notEqual(pepeCoinInstance.address, "");
    assert.notEqual(pepeCoinInstance.address, " ");
  });

  it("Should successfully mint PepeCoins", async () => {
    let mintPepeCoins = await pepeCoinInstance.mintPepeCoins(user1, mintAmount);
  });

  it("Should successfully return correct amount of PepeCoins", async () => {
    let numberOfPepeCoins = await pepeCoinInstance.balanceOf.call(user1);
    assert.strictEqual(
      numberOfPepeCoins.toNumber(),
      mintAmount,
      "Number of PepeCoins minted should be the same as balance"
    );
  });
});
