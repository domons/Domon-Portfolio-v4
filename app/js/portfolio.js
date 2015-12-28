var portfolioSection = {
	apiUrl: 'http://domons.net/backend/',
	works: null,
	currentWork: 1,

	loadWorks: function() {
		var self = this;

		$.ajax({
			url: self.apiUrl + 'portfolio',
			dataType: 'json',
			async: false,
			success: function(works) {
				self.works = works;

				$('.portfolio-thumbnails').append('<span class="thumbs-toggle"><b>1</b> / '+ works.length +'</span><ul></ul>');

				for (var i = 0; i < works.length; i++) {
					self.appendWork(works[i]);
				}

				self.changeWork(1);
			},
			error: function(error) {
				console.log(error.statusText + ' ' + error.status);
			}
		});
	},

	appendWork: function(work) {
		var html = '<div class="work-slide" data-slug="' + work.slug + '">' +
						'<div class="work-bg" style="background-image:url(' + this.apiUrl + 'Upload/works/' + work.background + ')"></div>' +
						'<div class="work-img" style="background-image:url(' + this.apiUrl + 'Upload/works/' + work.image + '); background-position:' + work.image_position + '"></div>' +
						(work.color ? '<div class="work-gradient" style="background:linear-gradient(to bottom, transparent 0%, ' + work.color + ' 100%)"></div>' : '') +
						'<div class="work-info">' +
							'<h2>' + (work.logo !== '' ? '<img src="' + this.apiUrl + 'Upload/works/' + work.logo + '" alt="' + work.title + '" class="logo" />' : work.title) + '</h2>' +
							'<ul><li>' + work.technologies.join('</li><li>') + '</li></ul>' +
							(work.url ? '<a href="'+ work.url +'" class="url" target="_blank"><span>Zobacz online</span></a>' : '') +
						'</div>' +
					'</div>';

		$('.portfolio-works').append(html);
		$('.portfolio-thumbnails ul').append('<li><a href="#portfolio/' + work.slug + '"><img src="' + this.apiUrl + 'Upload/works/' + work.thumb + '" alt="' + work.title + '" /></a></li>');
	},

	changeWork: function(index) {
		var self = this;

		// change work animate


		$('.portfolio-section .work-slide:nth-of-type('+self.currentWork+')')
			.css('z-index',2);

		$('.portfolio-section .work-slide:nth-of-type('+index+')')
			.show()
			.css('z-index',1);


		// end animate

		self.currentWork = index;

		var $logo = $('.portfolio-section .work-slide:nth-of-type('+index+') h2 img');

		$logo.each(function() {
			if (this.complete) {
				if ( ! $logo.attr('style'))
					$logo.height($logo.height()/2);
			}
		});


		$('.portfolio-thumbnails li:nth-of-type('+index+') a')
			.addClass('active')
			.parent()
			.siblings()
			.children('a')
			.removeClass('active');


		$('.portfolio-thumbnails .thumbs-toggle b').text(index);

		var margin = index > 3 ? (120*(index-3)) : 0;
		var endBottom = $('.portfolio-thumbnails ul').height() - $(window).height();

		if (margin*-1 > endBottom)
			margin = endBottom;

		$('.portfolio-thumbnails ul').animate({ scrollTop: margin }, 300);
	},

	afterWorkLoad: function(index) {
	},

	onInit: function() {
		this.loadWorks();


		var $worksImg = $('.portfolio-section .work-img'),
			$thumbsList = $('.portfolio-thumbnails ul'),
			self = this;

		$thumbsList.niceScroll({
			touchbehavior: true,
			bouncescroll: true,
			cursoropacitymin: 0,
			cursoropacitymax: 0,
			cursorwidth: 0,
			cursorborder: 0,
			railalign: 'left'
		});

		$('.portfolio-section').on('mousemove', function(e) {
			var offsetX = 0.5 - e.pageX / $(window).width(),
				translate = 'translate3d(' + Math.round(offsetX * 25) + 'px,0,0)'

			$worksImg.css({
				'-webkit-transform': translate,
				'transform': translate
			});
		});

		$('.portfolio-thumbnails .thumbs-toggle').on('click', function() {
			var val = $thumbsList.width() > 0 ? 0 : 180;

			$thumbsList.animate({ width: val }, 200, 'easeInOutCubic');
			$worksImg.animate({ marginLeft: val }, 200, 'easeInOutCubic');
		});

		$('.portfolio-section .portfolio-works').on('click', function() {
			$thumbsList.animate({ width: 0 }, 200, 'easeInOutCubic');
			$worksImg.animate({ marginLeft: 0 }, 200, 'easeInOutCubic');
		});

		$thumbsList.on('click', 'a', function(e) {
			e.preventDefault();

			var index = $(this).parent().index() + 1;
			self.changeWork(index);
		});
	}
};

$(function() {
	portfolioSection.onInit();
});