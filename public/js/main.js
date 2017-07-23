$(function () {

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
	        	var buffer = this.result;
	      		fileName = file.name;
	      		fileContents = buffer;
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
	    	reader.readAsBinaryString(file);
    	} else {
    		fileName = undefined;
    		fileContents = undefined;
    		$("#btn-file-submit").hide();
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
				console.log(a);
			}
		)
	});

	// -- Search to Download --
	$("#btn-search-hash").click((e) => {
		e.preventDefault();
		let searchVal = $("#search-hash").val();

		downloadFile("/downloadipfs?hashToDl=" + searchVal)
	    .then((contents) => {
	    	saveAs(new Blob([contents.data]), contents.name);
	    });
	});
});