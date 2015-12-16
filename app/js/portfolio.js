var portfolioSection = {
	apiUrl: 'http://domons.net/backend/',
	works: null,

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
			},
			error: function(error) {
				console.log(error.statusText + ' ' + error.status);
			}
		});
	},

	appendWork: function(work) {
		var html = '<div class="work-slide" data-id="' + work.id + '" data-slug="' + work.slug + '">' +
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
		$('.portfolio-thumbnails ul').append('<li><a href="#portfolio/' + work.slug + '" data-id="' + work.id + '"><img src="' + this.apiUrl + 'Upload/works/' + work.thumb + '" alt="' + work.title + '" /></a></li>');
	},

	changeWork: function(id) {
		console.log('change work ' + id);
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

			var id = $(this).data('id');
			self.changeWork(id);
		});
	}
};

$(function() {
	portfolioSection.onInit();
});