var Meme = artifacts.require("./Meme.sol");
var User = artifacts.require("./User.sol");
var PepeCoin = artifacts.require("./PepeCoin.sol");
var MemeketPlace = artifacts.require("./MemeketPlace.sol");
var likeMemeReward = 1;
var createMemeReward = 50;
var createUserReward = 100;

module.exports = async function(deployer, network, accounts) {

  let deployAddress = accounts[0]; // by convention

  if( network == "mainnet" ) {            
    throw "Halt. Sanity check. Not ready for deployment to mainnet. Manually remove this throw and try again.";
  }
  console.log('deploying from:' + deployAddress);
  await deployer.deploy(Meme, {from: deployAddress});
  await deployer.deploy(User, {from: deployAddress});
  await deployer.deploy(PepeCoin, User.address);
  await deployer.deploy(MemeketPlace,
    Meme.address,
    User.address,
    PepeCoin.address,
    likeMemeReward,
    createMemeReward,
    createUserReward,{from: deployAddress});
};

