var Adoption = artifacts.require("Adoption");
var Subscription = artifacts.require("Subscription");

// module.exports = function(deployer) {
//   deployer.deploy(Adoption);
//   deployer.deploy(Subscription);
// };

module.exports = function(deployer) {
    deployer.then(async () => {
        await deployer.deploy(Subscription);
        await deployer.deploy(Adoption, Subscription.address);
    })
}
