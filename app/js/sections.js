var sections = {
	currentPage: 0,


	onScroll: function() {
		var self = this;

		$('body').on('mousewheel', function(event) {
			event.deltaY > 0 ? --self.currentPage : ++self.currentPage;

			if (self.currentPage === -1) {
				self.currentPage = 0;
			} else if (self.currentPage > 4) {
				self.currentPage = 4;
			}

			var pageName = ['welcome', 'aboutme', 'technologies', 'portfolio', 'contact'];
			var pagePos = $('section.'+pageName[self.currentPage]+'-section').offset().top;

			$('html, body').stop().animate({ scrollTop: pagePos },600);

			return false;
		});
	}
};

$(function() {

//	sections.onScroll();
});