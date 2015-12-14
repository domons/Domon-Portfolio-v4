var sections = {
	current: 0,
	names: ['welcome', 'aboutme', 'technologies', 'portfolio', 'contact'],
	isScrolled: false,

	onScroll: function() {
		var self = this;

		$(document)
			.on('mousewheel', function(e) {
				if (self.isScrolled)
					return false;

				e.deltaY > 0 ? --self.current : ++self.current;

				self.scrollToSection(self.current);

				return false;
			})
			.on('keydown', function(e) {
				if (self.isScrolled)
					return false;

				if (e.keyCode == 38) { 
					--self.current;
				} else if (e.keyCode == 40) {
					++self.current;
				}

				self.scrollToSection(self.current);

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

		self.current = section;
		self.isScrolled = true;

		var pagePos = $('section.'+self.names[section]+'-section').offset().top;

		$('html, body')
			.stop()
			.animate({ scrollTop: pagePos }, 1000, 'easeOutCubic', function() {
				self.isScrolled = false;
			});

		$('.main-header nav li a[href="#'+self.names[section]+'"]')
			.addClass('active')
			.parent().siblings().children('a')
			.removeClass('active');

		$('.mousehint-fixed .mousehint-square').attr('data-section', ++section);

		location.hash = self.names[self.current];
	},

	onInit: function() {
		var self = this;

		if (location.hash !== '') {
			var section = location.hash.replace('#','');
			section = self.names.indexOf(section);

			self.scrollToSection(section);
		}

		$('.main-header a, .mousehint-fixed .mousehint-square').on('click', function(e) {
			e.preventDefault();

			var section = $(this).data('section');
			self.scrollToSection(section);
		});
	}
};

$(function() {
	sections.onInit();
	sections.onScroll();
});