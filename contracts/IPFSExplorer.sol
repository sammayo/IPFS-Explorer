pragma solidity ^0.4.11;

contract IPFSExplorer {
	struct file {
		string name;
		string extension;
		bytes32 ipfsHash;
	}

	file[] public files;

	function getName(uint num) returns (string) {
		return files[num].name;
	}

	function getExtension(uint num) returns (string) {
		return files[num].extension;
	}

	function getHash(uint num) returns (bytes32) {
		return files[num].ipfsHash;
	}

	function addFile(string _name, string _extension, bytes32 _ipfsHash) {
		files.push(file({name: _name, extension: _extension, ipfsHash: _ipfsHash}));
	}
}