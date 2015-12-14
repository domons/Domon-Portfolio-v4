var sections = {
	currentPage: 0,
	pageName: ['welcome', 'aboutme', 'technologies', 'portfolio', 'contact'],
	isScrolled: false,

	onScroll: function() {
		var self = this;

		$('body').on('mousewheel', function(event) {
			if (self.isScrolled)
				return false;

			self.isScrolled = true;

			event.deltaY > 0 ? --self.currentPage : ++self.currentPage;

			if (self.currentPage === -1) {
				self.currentPage = 0;
			} else if (self.currentPage > 4) {
				self.currentPage = 4;
			}

			var pagePos = $('section.'+self.pageName[self.currentPage]+'-section').offset().top;

			$('html, body')
				.stop()
				.animate({ scrollTop: pagePos }, 600, 'swing', function() {
					self.isScrolled = false;
				});

			$('.main-header nav li a[href="#'+self.pageName[self.currentPage]+'"]')
				.addClass('active')
				.parent().siblings().children('a')
				.removeClass('active');

//			location.hash = self.pageName[self.currentPage];

			return false;
		});
	},

	onInit: function() {
		var self = this;

		self.currentPage = Math.round($('html').scrollTop() / $(window).height(), 0);

		var pagePos = $('section.'+self.pageName[self.currentPage]+'-section').offset().top;
		$('html, body').stop().animate({ scrollTop: pagePos }, 600, 'swing');

		$('.main-header nav li a[href="#'+self.pageName[self.currentPage]+'"]').addClass('active');
	}
};

$(function() {
	sections.onInit();
	sections.onScroll();
});