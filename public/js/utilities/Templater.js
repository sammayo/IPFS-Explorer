/**
 * Allows for easily templating a project,
 * where templating refers to basically using ajax and "widgets"
 * to keep code structured and easily adaptable
 */
$(function() {

	/**
	 * Downloads template from a file
	 * @param templateFileUrl template file url
	 * @param callback callback (err, data)
	 */
	var Templater = function (templateFileUrl, callback) {
		$.ajax({
			url: templateFileUrl,
			type: "GET",
			contentType: "text/plain",
			success: function(templateData) {
				callback(null, templateData);
			},
			error: function(err) {
				callback(err, null);
			}
		});
	};
	window.Templater = Templater;
});