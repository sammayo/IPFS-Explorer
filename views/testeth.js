const Web3 = require('web3');
const contract = require('truffle-contract');

if (typeof web3 !== 'undefined') {
  console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
  // Use Mist/MetaMask's provider
  window.web3 = new Web3(web3.currentProvider);
} else {
  console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
  // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
  window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

let addFile, getName, getHash;
$.get("/downloadartifact", (res) => {
	var artifact = res;
	var exp;
	
	// MetaCoin is our usable abstraction, which we'll use through the code below.
	var IPFSExplorer = contract(artifact);

	IPFSExplorer.setProvider(web3.currentProvider);

	// Get the initial account balance so it can be displayed.
	addFile = function(name, hash) {
		return new Promise((resolve, reject) => {
			IPFSExplorer.deployed().then(function(instance) {
				exp = instance;
				return exp.addFile(name, hash, {from: web3.eth.accounts[0]});
			}).then(function(result) {
				resolve(result);
			});
		})
	}
	getName = function(num) {
		return new Promise((resolve, reject) => {
			var name;
			IPFSExplorer.deployed().then(function(instance) {
				exp = instance;
				return exp.getName.call(num);
			}).then(function(result) {
				resolve(result);
			});
		})
	}
	getHash = function(num) {
		return new Promise((resolve, reject) => {
			var name;
			IPFSExplorer.deployed().then(function(instance) {
				exp = instance;
				return exp.getHash.call(num);
			}).then(function(result) {
				resolve(result);
			});
		})
	}
});

window.pane = {addFile: addFile}