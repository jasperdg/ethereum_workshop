var Auction = artifacts.require("./Auction.sol");

module.exports = function(deployer) {
  deployer.deploy(Auction, 300, "0xBA079e1458F7539dCBC6cAE658566027aA0C24E2");
};
