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
					self.scrollToSection(--self.current);
				} else if (e.keyCode == 40) {
					self.scrollToSection(++self.current);
				}

				return true;
			})
			.on('mousedown', function(e) {
				if (e.which == 2)
					e.preventDefault();
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

		var sectionName = self.names[section];

		$.event.trigger({
			type: 'onSectionScrollStart',
			message: sectionName
		});

		var pagePos = $('section.'+sectionName+'-section').offset().top;

		$('html, body')
			.stop()
			.animate({ scrollTop: pagePos }, 1000, 'easeOutCubic')
			.promise().done(function() {
				self.isScrolled = false;

				$.event.trigger({
					type: 'onSectionScrollEnd',
					message: sectionName
				});
			});

		$('.main-header nav li a[href="#'+sectionName+'"]')
			.addClass('active')
			.parent().siblings().children('a')
			.removeClass('active');

		$('.mousehint-fixed .mousehint-square').attr('data-section', ++section);

		location.hash = sectionName;
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