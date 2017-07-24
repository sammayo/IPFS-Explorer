pragma solidity ^0.4.11;

contract IPFSExplorer {
	struct file {
		string name;
		string ipfsHash;
	}

	file[] public files;

	function getName(uint num) constant returns (string) {
		return files[num].name;
	}

	function getHash(uint num) constant returns (string) {
		return files[num].ipfsHash;
	}

	function getNumFiles() constant returns (uint) {
		return files.length;
	}

	function addFile(string _name, string _ipfsHash) {
		files.push(file({name: _name, ipfsHash: _ipfsHash}));
	}
}