var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var Meme = artifacts.require("./Meme.sol");
var User = artifacts.require("./User.sol");
var MemeketPlace = artifacts.require("./MemeketPlace.sol");

module.exports = async function(deployer, network, accounts) {

  let deployAddress = accounts[0]; // by convention

  if( network == "mainnet" ) {            
    throw "Halt. Sanity check. Not ready for deployment to mainnet. Manually remove this throw and try again.";
  }
  console.log('deploying from:' + deployAddress);
  await deployer.deploy(SimpleStorage, {from: deployAddress});
  await deployer.deploy(Meme, {from: deployAddress});
  await deployer.deploy(User, {from: deployAddress});
  await deployer.deploy(MemeketPlace, Meme.address, User.address,{from: deployAddress});
};