$(function () {
	console.log("FUCK");
	console.log(window);
	const Web3 = require('web3');
	const contract = require('truffle-contract');
	
	var web3 = new Web3(window.web3.currentProvider);//new Web3.providers.HttpProvider("http://localhost:8545"));

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
				IPFSExplorer.at("0xc5DC9A3048D7305Ad01d4EeAF8c329cf03f0F63e").then(function(instance) {
					
					window.myContract = instance;
					exp = instance;
					console.log('c')
					return exp.addFile(name, hash, {from: window.web3.eth.accounts[0]});
				}).then(async function(result) {
					console.log('d')
					// let f = await exp.getNumFiles.call();
					// console.log(f);
					resolve(result);
				});
			});
		}
		getName = function(num) {
			return new Promise((resolve, reject) => {
				
				window.myContract.getName.call(num)
				.then((result) => {
					console.log("NAME " +result);
					resolve(result);
				});
			});
		}
		getHash = function(num) {
			return new Promise((resolve, reject) => {
				// IPFSExplorer.deployed().then(function(instance) {
					// exp = instance;
				window.myContract.getHash.call(num)
				.then((result) => {
					console.log("HASH " +result);
					resolve(result);
				});
				// }).then(function(result) {
					// resolve(result);
				// });
			});
		}
		getNumFiles = function() {
			return new Promise((resolve, reject) => {
				window.myContract.getNumFiles.call()
				.then((res) => {
					// console.log(res);
					resolve(res.toNumber());
				});

				// IPFSExplorer.deployed().then(function(instance) {
					// exp = instance;
					// return exp.getNumFiles.call();
				// }).then(function(result) {
					// resolve(result);
				// });
			});
		}

		window.pane = {"addFile": addFile, "getName": getName, "getHash": getHash, "getNumFiles": getNumFiles}
		window.mane = window.pane;

		console.log("MANE " + window.mane);
		console.log(window );
	});
});