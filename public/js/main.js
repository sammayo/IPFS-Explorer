$(function () {

	// Backbone
	var Downloadable = Backbone.Model.extend({});
	var Downloadables = Backbone.Collection.extend({
		model: Downloadable
	});

	var downloadables = new Downloadables();

	var columns = [
	    {
	        name: "fileName",
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
		});
	        let str = JSON.stringify(model.attributes);
	        console.log(str);
	        tingleModal.setContent(str);
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

	// Read file data on upload
	$("#in-file").change(function () {
		var reader = new FileReader();
		let file = this.files[0];
    	reader.onload = function () {
        	var buffer = this.result;
      		// console.log(buffer);
      		downloadables.push({
      			fileName: "File name",
      			dateAdded: "1",
      			numDownloads: "2",
      			numUpVotes: "3",
      			numDownVotes: "4",
      			contents: buffer
      		});
      		view.render();
        }
        console.log(file);
    	reader.readAsBinaryString(file);
	});
});