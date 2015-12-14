var welcomeSection = {
	animations: ['rubberBand','pulse','wobble','bounce','shake','swing','tada'],
	$trianglesParallax: $('.triangles-parallax'),
	$window: $(window),

	trianglesTransform: function(offsetX, offsetY)
	{
		this.$trianglesParallax.find('span').each(function(i, el) {
			var offset = parseInt($(el).data('offset'));
			var translate = 'translate3d(' + Math.round(offsetX * offset) + 'px,' + Math.round(offsetY * offset) + 'px, 0px)';

			$(el).css({
				'-webkit-transform': translate,
				'transform': translate
			});
		});
	},

	triangles: function()
	{
		var self = this;

		if (window.DeviceMotionEvent)
		{
			window.addEventListener('devicemotion', function motion(e) {
				var offsetX = 0.5 - e.accelerationIncludingGravity.x.toFixed(3)*20 / self.$window.width() - 0.6;
				var offsetY = 0.5 - e.accelerationIncludingGravity.z.toFixed(3)*30 / self.$window.height() - 0.6;
				self.trianglesTransform(offsetX, offsetY);
			}, false);
		}

		self.$window.on('mousemove', function(e) {
			var offsetX = 0.5 - e.pageX / self.$window.width();
			var offsetY = 0.5 - e.pageY / self.$window.height();
			self.trianglesTransform(offsetX, offsetY);
		});

		self.$trianglesParallax.children('span')
			.css('left', '-100%')
			.each(function() {
				var margins = [-100, 200];

				$(this).css({
					'left': margins[Math.floor(Math.random()*margins.length)]+'%',
					'top': margins[Math.floor(Math.random()*margins.length)]+'%'
				});

				var time = (10 + Math.random()*40) * 60;
				$(this).animate({ left:'49%', top:'44%' }, time, 'easeInOutCubic');
			});

		setInterval(function() {
			var child = Math.round(Math.random()*8+1,0);
			var $triangle = self.$trianglesParallax.find('span:nth-of-type('+child+') i');
			self.animateTriangle($triangle);
		}, 4000);
	},

	animateTriangle: function($triangle)
	{
		var anim = 'animated';

		if (this.$window.width() > 750) {
			anim = anim+' '+this.animations[Math.floor(Math.random()*this.animations.length)];
		}

		$triangle
			.addClass(anim)
			.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
				$triangle.removeClass();
			});
	},

	onScroll: function()
	{
		var self = this;

		self.$window.scroll(function() {
			var wScroll = self.$window.scrollTop();

			if (wScroll < self.$trianglesParallax.height())
			{
				var translate = -(wScroll * 0.5);

				$('.triangles-parallax').css({
					'transform': 'translate(0, '+translate+'px)',
					'-webkit-transform': 'translate(0, '+translate+'px)'
				});

				var scale = 100 * wScroll / self.$trianglesParallax.height();
				scale = 1 - (scale / 100);

				$('.welcome-section .content').css({
					'transform': 'scale('+scale+')',
					'-webkit-transform': 'scale('+scale+')',
					'opacity': scale
				});

				$('.welcome-section').css({
					'box-shadow': 'inset 0 -'+(wScroll * .5)+'px 100px -100px rgba(0,0,0,0.7)'
				});
			}
		});
	},

	onInit: function()
	{
		this.triangles();
		this.onScroll();

		$('.welcome-section h2').addClass('animated slideInUp');
		$('.welcome-section p').css('opacity',0).delay(2000).animate({opacity:1},1500);

		if (this.$window.scrollTop() === 0) {
			$('.welcome-square')
				.css('bottom', -425)
				.animate({ bottom:-166 }, 800);
		}

		setTimeout(function() {
			$('.welcome-square').addClass('draw-lines');
		}, 800);
	}
};

$(function() {
	welcomeSection.onInit();
});