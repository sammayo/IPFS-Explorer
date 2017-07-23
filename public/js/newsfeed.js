/**
Handles the Asynchronous display of the user's profile
*/
$(function () {
	var postCollection = new PostCollection();
	

	Templater('/templates/newsfeed_posts_template.tmpl', 
			function (err, templateData) {
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
				/*
					TODO: Query smart contract asking
					for all stored data
				*/
				$.ajax({
					url: '/getpostsnewsfeed', 
					type: "GET",
					success: function (a, b, res) {
						var posts = res.responseJSON.posts;
						console.log(res.responseJSON);
						var models = [];
						$.each(posts, function (i, post) {
							models.push(new PostModel(post));
						});
						postCollection.reset(models);
					}, error: function (a, b, c) {
						console.log("failed");
					}
				});
			}

			displayPosts();
			setInterval(displayPosts, 10000);

			window.updateNewsfeedPosts = displayPosts;
		}
	);
});