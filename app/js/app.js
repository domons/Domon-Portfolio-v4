var app = {

	mouseHint: function() {
		var mouseHintUpdated = false;

		$('.mousehint-fixed')
			.css('opacity', 0)
			.delay(800)
			.animate({ opacity: 1 }, 1000);

		var params = {
			mouseHintScaleStart: 1,
			mouseHintScaleMin: 0.65,
			mouseHinBottomStart: 0,
			mouseHinBottomMove: 90,
			pointTop: 235
		};

		if ($(window).width() <= 1400) {
			params = {
				mouseHintScaleStart: 0.7,
				mouseHintScaleMin: 0.65,
				mouseHinBottomStart: 121,
				mouseHinBottomMove: 40,
				pointTop: 164
			}
		}

		$(window).scroll(function() {
			var wScroll = $(this).scrollTop();

			if ( ! mouseHintUpdated || wScroll < $('.welcome-section').height()*2) {
				var mouseHintScale = params.mouseHintScaleStart - (wScroll / 1400);
				mouseHintScale = mouseHintScale < params.mouseHintScaleMin ? params.mouseHintScaleMin : mouseHintScale;

				var bottom = (wScroll / 10) + params.mouseHinBottomStart;
				bottom = bottom > params.mouseHinBottomStart + params.mouseHinBottomMove ? params.mouseHinBottomStart + params.mouseHinBottomMove : bottom;

				$('.mousehint-square').css({
					'transform': 'rotate(-45deg) scale('+mouseHintScale+')',
					'-webkit-transform': 'rotate(-45deg) scale('+mouseHintScale+')'
				});

				$('.mousehint-fixed').css({
					'transform': 'translate(0, '+bottom+'px)'
				});

				mouseHintUpdated = true;
			}

			if (wScroll > $('.portfolio-section').offset().top) { // contact section
				$('.mousehint-fixed').hide();
				$('.point-fixed').css('margin-top', '100px');
			} else {
				$('.mousehint-fixed').show();
				$('.point-fixed').css('margin-top', params.pointTop + 'px');
			}
		});
	},

	portfolioThumbsRecalc: function() {
		var margin = $('.welcome-section').height();
		margin += $('.aboutme-section').height();
		margin += $('.technologies-section').height();

		$('.portfolio-thumbnails').css({
			'top': margin
		});
	},

	onInit: function() {
		this.mouseHint();

		$('html').niceScroll({
			zindex: -1,
			enablekeyboard: false,
			spacebarenabled: false
		});

		$('.main-header').midnight({
			dataAttr: 'header'
		});

		$('.point-fixed').midnight({
			dataAttr: 'point',
			headerClass: 'midnightPoint',
			innerClass: 'pointInner'
		});

		$('.mousehint-fixed').midnight({
			dataAttr: 'mousehint'
		});

		AOS.init({
//			once: true
		});

		$('.mobile-menu-toggle').on('click', function() {
			$('.mobile-menu-toggle i').toggleClass('transformed');
//			$('.mobile-nav').toggleClass('show'); TODO mobilenav header class
		});

		this.portfolioThumbsRecalc();
		$(window).resize(this.portfolioThumbsRecalc);
	}
};


$(function() {

	// TODO move to technologies.js
	$('.technologies-carousel').owlCarousel({
		loop: true,
		margin: 0,
		nav: false,
		dots: true,
		items: 1,
		autoplay: true,
		autoplayTimeout: 15000,
		autoplayHoverPause: true,
		autoplaySpeed: 600,
		dotsSpeed: 600,
		dragEndSpeed: 600
	});

	$('.technologies-carousel .owl-controls').attr({
		'aos': 'fade-up',
		'aos-delay': '500',
		'aos-duration': '800'
	});

});

$(function() {
	// TODO change section listener
	$(document).on('onSectionScrollStart', function(e) {
		console.log('onSectionScrollStart: '+ e.message);
	});

	$(document).on('onSectionScrollEnd', function(e) {
		console.log('onSectionScrollEnd: '+ e.message);
	});

	app.onInit();
	sections.onInit();
	sections.onScroll();
	welcomeSection.onInit();
});

// TODO
//$(window).load(function() {
//	$('.loader').fadeOut();
//});
