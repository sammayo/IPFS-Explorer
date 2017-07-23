$(function() {
	var PostCollection = Backbone.Collection.extend({
		model: window.PostModel
	});
	window.PostCollection = PostCollection;
});