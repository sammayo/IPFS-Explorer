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

			console.log("FUDGE");
			var imgData;
			//Create the post
			var post = {};

			if (memeSelected) {
				imgData = window.getImageFromCanvas();
			} else {
				// Don't post if no meme selected
				swal.close();
				return;
			}
			
			//Perform ajax request to add the post
			var performPost = function() {	
				/*
					TODO Add imgData to smart contract
				*/
				$.post("/uploadipfs", {
						file: {
							name: "abcd",
							contents: imgData
						}
					}, (a) => {
						var tingleModal = new tingle.modal({});
						console.log(typeof a.hash)
						var r;
						console.log(window);
						console.log(window.mane);
						var fileName = "abcd";
						window.mane.addFile(fileName, a.hash).then(function(result) {
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
				// console.log(imgData);
			};
			performPost();

			swal.close();
	});
});