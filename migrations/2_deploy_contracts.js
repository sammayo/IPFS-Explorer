var Explorer = artifacts.require("./IPFSExplorer.sol");

module.exports = function(deployer) {
  deployer.deploy(Explorer);
};
