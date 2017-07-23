/*
 * Handles the generation of posts and at a high-level manages the meme
 * creation flow
 */
$(function () {

	var memeBuilder;

	$(this).on("change", "#meme-option-upload-file-input", function () {
		var file = $(this)[0].files[0];
		if (file) {
			var fr = new FileReader();

			fr.onload = function () {
				var imgData = fr.result;
				$("#start-image").attr('src', imgData);
			};

			fr.readAsDataURL(file);
		}
	});

	$(this).on("click", ".meme-option", function () {
		$(".meme-option").removeClass("meme-option-selected");
		$(this).addClass("meme-option-selected");
		var imgSrc = $(this).find('img').attr('src');
		$("#start-image").attr('src', imgSrc);

		var selectedMemeID = $(".meme-option-selected").attr("id");

		if (selectedMemeID === "meme-option-upload") {
			$("#meme-option-upload-file-input").click();
			$("#meme-builder-container").append(memeBuilder);
		} else if (selectedMemeID === "meme-option-no-meme") {
			var builder = $("#meme-builder");
			if (builder.length > 0) {
				memeBuilder = $("#meme-builder")[0];
			}
			$("#meme-builder").remove();
		} else {
			$(memeBuilder).find("#start-image").attr('src', imgSrc);
			if ($("#meme-builder-container").find(memeBuilder).length === 0) {
				$("#meme-builder-container").append(memeBuilder);
			}
		}
	});

	$(this).on("click", ".post-modal-cancel-btn", function () {
		swal.close();
	});

	var verifyPost = function(msg, memeSelected) {
		if (!memeSelected && !msg) {
			return "Need to enter a message or create a meme";
		}
		return "";
	};

	$(this).on("click", ".post-modal-post-btn", function () {
		$(this).prop("disabled", true);
		var selectedMeme = $(".meme-option-selected");
		var selectedMemeID = $(selectedMeme).attr("id");
		var memeSelected = "meme-option-no-meme" !== selectedMemeID;

		var msg = $("#meme-msg").val();
		var verificationError = verifyPost(msg, memeSelected);

		if (!verificationError) {
			
			var postType = $(".post-maker-template").attr("posttype");
			var imgData;
			//Create the post
			var post = {};
			if (msg)
				post.text = msg;
			if (memeSelected) {
				imgData = window.getImageFromCanvas();
			}

			var url;
			if (postType === "post") {
				var pathComponents = window.location.pathname.split('/');
				if (pathComponents[1]) {

					//Set to_user to the profile page we are currently viewing
					//Note: We will verify in the route whether we are friends
					//before allowing the post to go through
					post.to_user = pathComponents[1];
				}

				url = "/addpost";
			} else if (postType === "comment") {
				url = "/addcomment";
				post.comment_id = $(".post-maker-template").attr("postid");
			}
			
			//Perform ajax request to add the post
			var performPost = function(postData) {	
				$.ajax({
					url: url,
					type: "POST",
					data: {post: postData},
					success: function (a, b, res) {
						if (window.updateProfilePosts) {
							window.updateProfilePosts();
						}
						if (window.updateNewsfeedPosts) {
							window.updateNewsfeedPosts();
						}
						if (window.updateComments && postData.comment_id) {
							window.updateComments(postData.comment_id);
						}
					},
					error: function (err) {
						$(".meme-post-error-label").text("Error: " + err);
					}
				});
			};

			swal.close();
			if (imgData) {
				$.ajax({
					url: "/addimage",
					type: "POST",
					data: {imgData: imgData},
					success: function (a, b, res) {
						var imgUrl = res.responseJSON.url;
						post.image = imgUrl;
						performPost(post);
					},
					error: function (err) {
						$(".meme-post-error-label").text("Error: " + err);
					},
					async: false
				});
			} else {
				performPost(post);
			}
		} else {
			$(".meme-post-error-label").text("Error: " + verificationError);
			$(this).prop("disabled", false);
		}
	});
});