var portfolioSection = {

	onInit: function() {

		$.ajax({
			url: 'http://domons.net/backend/portfolio',
			dataType: 'json',
			async: false,
			success: function(json) {
				console.log(json);
			},
			error: function(error) {
				console.log(error.statusText + ' ' + error.status);
			}
		});

	}
};

$(function() {
	portfolioSection.onInit();
});