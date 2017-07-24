/**
Handles the Asynchronous display of the user's profile
*/

$(function () {

	// -------

	const Web3 = require('web3');
	const contract = require('truffle-contract');

	var web3 = new Web3(window.web3.currentProvider);//new Web3.providers.HttpProvider("http://localhost:8545"));

	// }

	let myPane;

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
					
					// window.myContract = instance;
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
				IPFSExplorer.at("0xc5DC9A3048D7305Ad01d4EeAF8c329cf03f0F63e")
				.then((instance) => instance.getName.call(num))
				.then((result) => {
					console.log("NAME " +result);
					resolve(result);
				});
			});
		}
		getHash = function(num) {
			return new Promise((resolve, reject) => {
				IPFSExplorer.at("0xc5DC9A3048D7305Ad01d4EeAF8c329cf03f0F63e")
				.then((instance) => instance.getHash.call(num))
				.then((result) => {
					// console.log("HASH " +result);
					resolve(result);
				});
			});
		}
		getNumFiles = function() {
			return new Promise((resolve, reject) => {
				IPFSExplorer.at("0xc5DC9A3048D7305Ad01d4EeAF8c329cf03f0F63e")
				.then((instance) => instance.getNumFiles.call())
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

		myPane = {"addFile": addFile, "getName": getName, "getHash": getHash, "getNumFiles": getNumFiles}
		window.mane = myPane;
		console.log(myPane);

		console.log("MANE " + JSON.stringify(window.mane));
		console.log(window );
	});

	let myFoo;

	// -------


	var postCollection = new PostCollection();
	

		Templater('/templates/newsfeed_posts_template.tmpl', 
				function (err, templateData) {
					console.log("ENTERS THIS");
				// window.mane.addFile("name", "foobar").then((result) => {
					// console.log("FIRST ADD " + result);
					$(function () {
						console.log("PUTTING IN ONE");
						postCollection.reset([new PostModel({
							"imgData": "foo"
						})]);
					});
				// })
			var displayPosts = function () {
					if (err) {
						//TODO: display error
						return;
					}
					var templateHtml = templateData;

					var postsView = 
						new PostsView({
							template: _.template(templateHtml),
							collection: postCollection,
							el: $("#posts")
						});
					// postCollection.reset([new PostModel({
					// 		"imgData": "foo"
					// 	})]);

					/*
						TODO: Query smart contract asking
						for all stored data
					*/

					// var files[]
					// var accesser = JSON.parse($("body").attr("potato"));
					// console.log("ACC " + JSON.stringify(accesser));
					myPane.getNumFiles().then(async function(result) {
						if (result === 0) {
							if (numFiles === 0) {
								postCollection.reset([new PostModel({
									"imgData": "foo"
								})]);
							}
						} else {
							console.log("num files YO = "+result);
							numFiles = result;
							let myModels = [];
							let remaining = numFiles - 1;
							for (let i=numFiles-1; i>=0; i--) {
								console.log("HIT1");
								myPane.getHash(i).then((hash) => {

									console.log("HIT2");
									$.get("/downloadipfs?hashToDl=" + hash, (res) => {
										console.log("HIT3");
										var model = new PostModel({
											"text": hash,
											"image": res.data
										});
										
										myModels.push(model);
										if (remaining < 2) {
											postCollection.reset(myModels);
											console.log("SHOULD ADD " + myModels.length);
										}
										remaining -= 1;
									});
								});
							}
							
						}
					});
					// $.ajax({
					// 	url: '/getpostsnewsfeed', 
					// 	type: "GET",
					// 	success: function (a, b, res) {
					// 		var posts = res.responseJSON.posts;
					// 		console.log(res.responseJSON);
					// 		var models = [];
					// 		$.each(posts, function (i, post) {
					// 			models.push(new PostModel(post));
					// 		});
					// 		postCollection.reset(models);
					// 	}, error: function (a, b, c) {
					// 		console.log("failed");
					// 	}
					// });
				}

				displayPosts();
				setInterval(displayPosts, 10000);

				window.updateNewsfeedPosts = displayPosts;
			}
		);
});