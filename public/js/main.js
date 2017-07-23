$(function () {
	setTimeout(() => {
		// const eth = window.pane;
		// console.log("eth: "+eth)
		// eth.addFile(fileName, a.hash).then(function(result) {
		// 	console.log("this is a transaction: "+result);
		// })

		// Utilities

		function downloadFile(url) {
			return new Promise((resolve, reject) => {
				$.get(url, (result) => resolve(result));
			});
		}

		// Backbone

		var Downloadable = Backbone.Model.extend({});
		var Downloadables = Backbone.Collection.extend({
			model: Downloadable
		});

		var downloadables = new Downloadables();

		var columns = [
		    {
		        name: "name",
		        label: "File Name",
		        cell: "string",
		        editable: false
		    }, {
		        name: "dateAdded",
		        label: "Date Added",
		        cell: "string",
		        editable: false
		    }, {
		        name: "numDownloads",
		        label: "Downloads",
		        cell: "string",
		        editable: false
		    }, {
		        name: "numUpVotes",
		        label: "Up Votes",
		        cell: "string",
		        editable: false
		    }, {
		        name: "numDownVotes",
		        label: "Down Votes",
		        cell: "string",
		        editable: false
		    }
		];



		var ClickableRow = Backgrid.Row.extend({
		    events: {
		        "click": "onClick"
		    },
		    onClick: function () {
		        let model = this.model;
		        console.log(model.attributes);

				var tingleModal = new tingle.modal({
					footer: true,
					closeMethods: ['overlay', 'button', 'escape']
				});
		        tingleModal.setContent("Download file " 
		        	+ model.attributes.name + " (" + model.attributes.hash + ")");

				// add a button
				tingleModal.addFooterBtn('Download', 'tingle-btn tingle-btn--primary', function() {
				    downloadFile("/downloadipfs?hashToDl=QmcXyUXRiV5bue6fzGdxbxYXHei5JVMcbnawPBZKSU2owa")
				    .then((contents) => {
				    	saveAs(new Blob([contents.data]), contents.name);
				    });
				});

				// add another button
				tingleModal.addFooterBtn('Cancel', 'tingle-btn tingle-btn--danger', function() {
				    // here goes some logic
				    tingleModal.close();
				});

		        tingleModal.open();
		    }
		});

		// Initialize a new Grid instance
		var grid = new Backgrid.Grid({
		    columns: columns,
		    collection: downloadables,
		    row: ClickableRow
		});

		// Render the grid and attach the root to your HTML document
		$("#view-downloadables").append(grid.render().el);

		// -- Upload button -- 

		var fileName;
		var fileContents;
		// Read file data on upload
		$("#in-file").change(function () {
			var reader = new FileReader();
			if (this.files.length > 0) {
				let file = this.files[0];
				reader.onload = function () {
					console.log(JSON.stringify(this.result) + " is of type: "+ typeof this.result + " and is of length "+this.result.byteLength)
		        	var buffer = this.result;
		      		fileName = file.name;
		      		fileContents = buffer;
		      		console.log(buffer);
		      		// console.log(parseInt(buffer[0]));
		      		$("#btn-file-submit").show();
		      		downloadables.push({
		      			name: "FUCK YEAH",
		      			dateAdded: "1",
		      			numDownloads: "2",
		      			numUpVotes: "3",
		      			numDownVotes: "4",
		      			contents: buffer,
		      			hash: "abcde"
		      		});
		        }
		        console.log(file);
		    	reader.readAsDataURL(file);
	    	} else {
	    		fileName = undefined;
	    		fileContents = undefined;
	    	}
		});

		$("#btn-file-submit").click(() => {
			console.log(fileName);
			$.post("/uploadipfs", 
				{
					file: {
						name: fileName,
						contents: fileContents
					}
				}, (a) => {
					var tingleModal = new tingle.modal({});
					console.log(typeof fileName)
					console.log(typeof a.hash)
					var r;
					eth.addFile(fileName, a.hash).then(function(result) {
						r = result;
					})
					// eth.getNumFiles().then(function(result) {
					// 	console.log(result)
					// })
		        	tingleModal.setContent(
		        		"<h1>Success</h1>"
		        		+ "<br>Uploaded File: " 
		        		+ fileName + "<br>Hash: " + a.hash+"<br>Eth tx: "+r);

		        	tingleModal.open();
				}
			)
		});

		// -- Search to Download --
		$("#btn-search-hash").click((e) => {
			e.preventDefault();
			let searchVal = $("#search-hash").val();
			downloadFile("/downloadipfs?hashToDl=" + searchVal)
		    .then((contents) => {
		    	download(contents.data, contents.name);
		    });
		});
	}, 1000)
});