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

				$('.portfolio-thumbnails').append('<a href="javascript:void(0)" class="thumbs-toggle"><span>1</span> / '+ works.length +'</a><ul></ul>');

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
		var html = '<div class="work-slide">' +
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

	onInit: function() {
		this.loadWorks();

		$('.portfolio-thumbnails ul').niceScroll({
			touchbehavior: true,
			bouncescroll: true,
			cursoropacitymin: 0,
			cursoropacitymax: 0,
			cursorwidth: 0,
			cursorborder: 0,
			railalign: 'left'
		});
	}
};

$(function() {
	portfolioSection.onInit();
});