$(function () {
	var Downloadable = Backbone.Model.extend({});
	var Downloadables = Backbone.Collection.extend({
		model: Downloadable
	});

	var downloadables = new Downloadables();

	var DownloadablesView = Backbone.View.extend({
		initialize: function () {
			console.log("INIT VIEW");
		}
	});

	var view = new DownloadablesView({
		el: $("#view-downloadables"),
		collection: downloadables,
		render: function () {
			console.log("HI");
			return this;
		}
	});
	console.log(view);
	view.render();
});