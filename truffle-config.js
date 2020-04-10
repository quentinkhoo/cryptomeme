// const path = require("path");

// module.exports = {
//   // See <http://truffleframework.com/docs/advanced/configuration>
//   // to customize your Truffle configuration!
//   contracts_build_directory: path.join(__dirname, "client/src/contracts"),
//   networks: {
//     development: {
//       host: "127.0.0.1",
//       port: 8545,
//       network_id: "*"
//     }
//   },
//   plugins: ["solidity-coverage"]
// };

let secrets = require('./secrets');
var mem = secrets.meta;
var HDWalletProvider = require("truffle-hdwallet-provider")
// const WalletProvider = require("truffle-wallet-provider");
// const Wallet = require('ethereumjs-wallet');

// let ropstenPrivateKey = new Buffer(secrets.ropstenPK, "hex");
// let ropstenWallet = Wallet.fromPrivateKey(ropstenPrivateKey);
// let ropstenProvider = new WalletProvider(mem,  "https://ropsten.infura.io/v3/b83df1f175b14580b49eba109101107d");
module.exports = {
  networks: {
    development: { host: "localhost", port: 8545, 
                   network_id: "*", gas: 4465030 },    
    ropsten: { provider: function() {
      return new HDWalletProvider(mem,"https://ropsten.infura.io/v3/16923192f0ca478ab86d2123538206bd")
    }, 
                   network_id: "3", gas: 4465030 }
  }
};