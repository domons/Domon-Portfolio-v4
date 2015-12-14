$(function() {

	var $img = $('.aboutme-section .photo img');
	var width =  $img.width();
	var height = $img.height();

	$('#canvas-photo').attr({
		'width': width,
		'height': height
	});

	$('.shadow').css({
		'width': width,
		'height': height
	});

	var looper,
		canvas = document.getElementById('canvas-photo'),
		context = canvas.getContext('2d'),
		nodes,
		NUM_NODES = 30,
		minDist = 120,
		springAmount = 0,
		rgb = '0,0,0';

	function nodes_init() {
		createNodes();
		context.lineWidth = 1.5;
		looper = setInterval(nodes_loop, 1000 / 31);
	}

	function createNodes() {
		nodes = [];
		for (var i = 0; i < NUM_NODES; i++) {
			var node = {
				radius: 2.5,
				x: Math.random() * width,
				y: Math.random() * height,
				vx: Math.random() * 6 - 3,
				vy: Math.random() * 6 - 3,
				mass: 1,
				update: function () {
					this.x += this.vx;
					this.y += this.vy;
					if (this.x > width) {
						this.x = 0;
					} else if (this.x < 0) {
						this.x = width;
					}
					if (this.y > height) {
						this.y = 0;
					} else if (this.y < 0) {
						this.y = height;
					}
				},
				draw: function () {
					context.fillStyle = 'rgb(0,0,0)';
					context.beginPath();
					context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
					context.closePath();
					context.fill();
				}
			};
			nodes.push(node);
		}
	}

	function nodes_loop() {
		context.clearRect(0, 0, canvas.width, canvas.height);
		for (i = 0; i < NUM_NODES; i++) {
			nodes[i].update();
			nodes[i].draw();
		}
		for (i = 0; i < NUM_NODES - 1; i++) {
			var node1 = nodes[i];
			for (var j = i + 1; j < NUM_NODES; j++) {
				var node2 = nodes[j];
				spring(node1, node2);
			}
		}
	}

	function spring(na, nb) {
		var dx = nb.x - na.x;
		var dy = nb.y - na.y;
		var dist = Math.sqrt(dx * dx + dy * dy);
		if (dist < minDist) {
			context.beginPath();
			context.strokeStyle = 'rgba(232,232,232,' + (1 - dist / minDist) + ')';
			context.moveTo(na.x, na.y);
			context.lineTo(nb.x, nb.y);
			context.stroke();
			context.closePath();
			var ax = dx * springAmount;
			var ay = dy * springAmount;
			na.vx += ax;
			na.vy += ay;
			nb.vx -= ax;
			nb.vy -= ay;
		}
	}

	nodes_init();
});