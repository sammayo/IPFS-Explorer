$(function () {

	// Initial
	$("#btn-file-submit").hide();

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
			    // var u = new Uint8Array(this.result),
			    //     a = new Array(u.length),
			    //     i = u.length;
			    // while (i--) // map to hex
			    //     a[i] = (u[i] < 16 ? '0' : '') + u[i].toString(16);
			    // u = null; // free memory
			    // console.log(a); // work with this
			// });
	    	// reader.onload = function () {
	        	var buffer = this.result;
	        	// var array = new Uint8Array(buffer);
	        	// var hex = Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
	    		// var text = uint8ToText(array);
	    		// console.log(array[0])
	    		// console.log(text)
	      		fileName = file.name;
	      		fileContents = buffer;
	      		//saveAs(new Blob([fileContents]), fileName);
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
				var tingleModal = new tingle.modal({});
	        	tingleModal.setContent(
	        		"<h1>Success</h1>"
	        		+ "<br>Uploaded File: " 
	        		+ fileName + "<br>Hash: " + a.hash);
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
	    	console.log(new Blob([contents.data]).toString());
	    	download(contents.data, contents.name);
	    });
	});
});

function uint8ToText(array) {
	var text = "";
	for(var i=0; i<array.length; i++) {
		text += String.fromCharCode(array[i]);
	}
	return text;
}