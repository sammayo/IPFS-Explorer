/*
 * Handles comments, likes, and generally event handlers connected to
 * the image feed
 */
$(function () {
	var self = this;

	Templater('/templates/post_maker.tmpl', function (err, templateData) {
		if (err) {
			return;
		} else {
			registerPostClick(templateData);
		}
	});

	var registerPostClick = function (posterTemplateHtml) {
		$(self).on("click", ".post-display-add-modal", function () {
			var postType = $(this).attr("postType");
			var titleTypeText = "";
			if (postType === "comment") {
				titleTypeText = "Comment";
			} else if (postType === "post") {
				titleTypeText = "Post";
			}

			var postID = $("#comments").attr("postid");

			posterTemplateHtml = $(posterTemplateHtml).attr("postid", postID);
			posterTemplateHtml = $(posterTemplateHtml).attr("posttype", postType);

			swal({
				title: titleTypeText,
				html: posterTemplateHtml,
				showCloseButton: false,
				showCancelButton: false,
				showConfirmButton: false,
				onOpen: function () {
					$.getScript("js/utilities/memegenerator.js");
				}
			}).catch(swal.noop);
		});
	};
});