$(function () {
	console.log("FUCK");
	console.log(window);
	const Web3 = require('web3');
	const contract = require('truffle-contract');
	// const HDWalletProvider = require("truffle-hdwallet-provider");

	// var secrets;
	// var mnemonic;
	// if(fs.existsSync("../../secrets.json")) {
	//   secrets = JSON.parse(fs.readFileSync("secrets.json", "utf8"));
	//   mnemonic = secrets.mnemonic;
	// } else {
	//   console.log("no secrets.json found. You can only deploy to the testrpc.");
	//   mnemonic = "" ;
	// }

	// const web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/hIIhvL77mY5xhwgaqRmz"));

	// if (typeof web3 !== 'undefined') {
	//   console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
	//   // Use Mist/MetaMask's provider
	//   window.web3 = new Web3(web3.currentProvider);
	// } else {
	//   console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
	//   // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
	   var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

	// }

	let addFile, getName, getHash, getNumFiles;
	$.get("/downloadartifact", (res) => {
		var artifact = res;
		console.log(artifact)
		var exp;
		
		// MetaCoin is our usable abstraction, which we'll use through the code below.
		console.log(TruffleContract);
		var IPFSExplorer = TruffleContract(artifact);

		IPFSExplorer.setProvider(web3.currentProvider);
		IPFSExplorer.setNetwork("1337");
		console.log("a")

		// var account = web3.personal.listAccounts[0];
		// web3.personal.unlockAccount(account, "pw", 15000);
		// Get the initial account balance so it can be displayed.
		addFile = function(name, hash) {
			console.log('b')
			return new Promise((resolve, reject) => {
				IPFSExplorer.deployed().then(function(instance) {
					exp = instance;
					console.log('c')
					return exp.addFile(name, hash, {from: window.web3.eth.accounts[0]});
				}).then(function(result) {
					console.log('d')
					resolve(result);
				});
			});
		}
		getName = function(num) {
			return new Promise((resolve, reject) => {
				IPFSExplorer.deployed().then(function(instance) {
					exp = instance;
					return exp.getName.call(num);
				}).then(function(result) {
					resolve(result);
				});
			});
		}
		getHash = function(num) {
			return new Promise((resolve, reject) => {
				IPFSExplorer.deployed().then(function(instance) {
					exp = instance;
					return exp.getHash.call(num);
				}).then(function(result) {
					resolve(result);
				});
			});
		}
		getNumFiles = function() {
			return new Promise((resolve, reject) => {
				IPFSExplorer.deployed().then(function(instance) {
					exp = instance;
					return exp.getNumFiles.call();
				}).then(function(result) {
					resolve(result);
				});
			});
		}

		window.pane = {"addFile": addFile, "getName": getName, "getHash": getHash, "getNumFiles": getNumFiles}
		window.mane = window.pane;
		console.log("MANE " + window.mane);
	});
});