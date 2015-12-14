var sections = {
	currentPage: 0,
	pageName: ['welcome', 'aboutme', 'technologies', 'portfolio', 'contact'],
	isScrolled: false,

	onScroll: function() {
		var self = this;

		$(document)
			.on('mousewheel', function(e) {
				if (self.isScrolled)
					return false;

				e.deltaY > 0 ? --self.currentPage : ++self.currentPage;

				self.scrollToSection(self.currentPage);

				return false;
			})
			.on('keydown', function(e) {
				if (self.isScrolled)
					return false;

				if (e.keyCode == 38) {
					--self.currentPage;
				} else if (e.keyCode == 40) {
					++self.currentPage;
				}

				self.scrollToSection(self.currentPage);

				return true;
			});
	},

	scrollToSection: function(section) {
		var self = this;

		if (section === -1) {
			section = 0;
		} else if (section > 4) {
			section = 4;
		}

		self.currentPage = section;
		self.isScrolled = true;

		var pagePos = $('section.'+self.pageName[section]+'-section').offset().top;

		$('html, body')
			.stop()
			.animate({ scrollTop: pagePos }, 900, 'easeOutCubic', function() {
				self.isScrolled = false;
			});

		$('.main-header nav li a[href="#'+self.pageName[section]+'"]')
			.addClass('active')
			.parent().siblings().children('a')
			.removeClass('active');

//			location.hash = self.pageName[self.currentPage];
	},

	onInit: function() {
		// TODO get location.hash
		var page = Math.round($('html').scrollTop() / $(window).height(), 0);
		this.scrollToSection(page);
	}
};

$(function() {
	sections.onInit();
	sections.onScroll();
});