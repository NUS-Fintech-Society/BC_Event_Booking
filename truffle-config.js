const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = "vendor hill purpose tired price cross shield found bunker bracket differ million";
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      websockets: true,
      network_id: "*" // Match any network id
    },
    develop: {
      port: 8545
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/bbe55a6e14814f7e8c791163fba1b440")
      },
      network_id: 3
    }
  }
};
