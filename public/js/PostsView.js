$(function () {
	var PostsView = Backbone.View.extend({
		initialize: function (options) {
			this.template = options.template;
			this.collection.on("reset", this.render, this);
		},
		render: function () {
			var renderedHtml = this.template({posts: this.collection.toJSON()});
			$(this.el).html(renderedHtml);
			return this;
		}
	});
	window.PostsView = PostsView;
});