const contract = require('truffle-contract');
const ipfs = require('browser-ipfs');
const fs = require('fs');
const Web3 = require('web3');

var web3;
if (typeof web3 !== 'undefined') {
	console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
	// Use Mist/MetaMask's provider
	web3 = new Web3(web3.currentProvider);
} else {
	console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
	// fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
	web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

var explorer_json = JSON.parse(fs.readFileSync("build/contracts/IPFSExplorer.json", "utf8"));
var explorer = contract(explorer_json);

ipfs.setProvider({host: 'localhost', port: '5001'})

ipfs.cat("Qmc7CrwGJvRyCYZZU64aPawPj7CJ56vyBxdhxa38Dh1aKt", function(err, text) {
	if (err) throw err;
	console.log(text); 	// "Testing..."
});

// function upload(type, data) {
// 	var file = {"extension":type,"raw_data":data};

// }