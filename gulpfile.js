/**
 * Dominik Barylski
 * Starter Kit
 * https://github.com/domons/Starter-Kit
 */

/*--------------------------------------------------------
| Configuration
| Tinypng api key:
|	https://tinypng.com/developers
--------------------------------------------------------*/
var config = {
	tinypngApiKey: '',
	appBase: './app',
	distBase: './dist',
	sassCache: './.sass-cache',
	autoprefixer: ['last 5 version']
},

path = {
	app: {
		css: config.appBase + '/css',
		fonts: config.appBase + '/fonts',
		images: config.appBase + '/images',
		jade: config.appBase + '/jade',
		jade_pages: config.appBase + '/jade/pages',
		js: config.appBase + '/js',
		scss: config.appBase + '/scss'
	},
	dist: {
		css: config.distBase + '/css',
		fonts: config.distBase + '/fonts',
		images: config.distBase + '/images',
		js: config.distBase + '/js'
	},
	watch: {
		css: config.appBase + '/css/**/*.css',
		fonts: config.appBase + '/fonts/**/*',
		images: config.appBase + '/images/**/*',
		distImages: config.distBase + '/images/**/*.{png,jpg,jpeg}',
		jade: config.appBase + '/jade/**/*.jade',
		jade_pages: config.appBase + '/jade/pages/*.jade',
		js: config.appBase + '/js/**/*.js',
		scss: config.appBase + '/scss/**/*.scss',
		extras: [config.appBase + '/*.{ico,png,txt}', config.appBase + '/.*']
	}
},


/*--------------------------------------------------------
| Scss files to compilation
--------------------------------------------------------*/
compileScssFiles = [
	path.app.scss + '/main.scss'
],


/*--------------------------------------------------------
| Concat rules
--------------------------------------------------------*/
concatJsFiles = {
	main: [
		path.app.js + '/aboutme-triangles.js',
		path.app.js + '/welcome.js',
		path.app.js + '/sections.js',
		path.app.js + '/app.js'
	],
	vendors: [
		path.app.js + '/vendors/*.js'
	]
},

concatCssFiles = {
	vendors: [
		path.app.css + '/animate.min.css',
		path.app.css + '/aos.min.css'
	]
},


/*--------------------------------------------------------
| Gulp modules
--------------------------------------------------------*/
gulp = require('gulp'),
jade = require('gulp-jade'),
compass = require('gulp-compass'),
argv = require('yargs').argv,
del = require('del'),
tinypng = require('gulp-tinypng-compress'),
browserSync = require('browser-sync').create(),
watch = require('gulp-watch'),
autoprefixer = require('gulp-autoprefixer'),
runSequence = require('run-sequence'),
minifyCss = require('gulp-minify-css'),
gulpif = require('gulp-if'),
jsmin = require('gulp-jsmin'),
concat = require('gulp-concat'),
concatCont = require('gulp-continuous-concat'),
replace = require('gulp-replace');


/*--------------------------------------------------------
| Jade
--------------------------------------------------------*/
function jadeTask() {
	return gulp.src(path.watch.jade_pages)
		.pipe(jade({
			pretty: ! argv.prod
		}))
		.pipe(gulp.dest(config.distBase));
}

gulp.task('jade', jadeTask);


/*--------------------------------------------------------
| Compass (sass)
--------------------------------------------------------*/
function compassTask() {
	return gulp.src(compileScssFiles)
		.pipe(compass({
			css: path.dist.css,
			sass: path.app.scss,
			image: path.dist.images,
			font: path.dist.fonts,
			style: 'expanded',
			relative: true
		}))
		.on('error', function(error) {
			console.log(error);
			this.emit('end');
		})
		.pipe(replace('../../', '../'))
		.pipe(replace(path.dist.images, '../images'))
		.pipe(autoprefixer({
			browsers: config.autoprefixer
		}))
		.pipe(gulpif(argv.prod, minifyCss()))
		.pipe(gulp.dest(path.dist.css));
}

gulp.task('compass', compassTask);


/*--------------------------------------------------------
| Javascript concat
--------------------------------------------------------*/
function concatJsTask(file) {
	gulp.task('javascript:concat:' + file, function() {
		return gulp.src(concatJsFiles[file])
			.pipe(concat(file + '.js'))
			.pipe(gulpif(argv.prod, jsmin()))
			.pipe(gulp.dest(path.dist.js));
	});
}

var concatJsTasks = [];
for (var file in concatJsFiles) {
	concatJsTask(file);
	concatJsTasks.push('javascript:concat:' + file);
}

gulp.task('javascript:concat', concatJsTasks);

gulp.task('javascript:concat-watch', function() {
	for (var file in concatJsFiles) {
		gulp.src(concatJsFiles[file])
			.pipe(watch(concatJsFiles[file]))
			.pipe(concatCont(file + '.js'))
			.pipe(gulpif(argv.prod, jsmin()))
			.pipe(gulp.dest(path.dist.js))
			.pipe(browserSync.stream());
	}
});


/*--------------------------------------------------------
| CSS concat
--------------------------------------------------------*/
function concatCssTask(file) {
	gulp.task('css:concat:' + file, function() {
		return gulp.src(concatCssFiles[file])
			.pipe(concat(file + '.css'))
			.pipe(autoprefixer({
				browsers: config.autoprefixer
			}))
			.pipe(gulpif(argv.prod, minifyCss()))
			.pipe(gulp.dest(path.dist.css));
	});
}

var concatCssTasks = [];
for (var file in concatCssFiles) {
	concatCssTask(file);
	concatCssTasks.push('css:concat:' + file);
}

gulp.task('css:concat', concatCssTasks);

gulp.task('css:concat-watch', function() {
	for (var file in concatCssFiles) {
		gulp.src(concatCssFiles[file])
			.pipe(watch(concatCssFiles[file]))
			.pipe(concatCont(file + '.css'))
			.pipe(autoprefixer({
				browsers: config.autoprefixer
			}))
			.pipe(gulpif(argv.prod, minifyCss()))
			.pipe(gulp.dest(path.dist.css))
			.pipe(browserSync.stream());
	}
});


/*--------------------------------------------------------
| Javascript copy
--------------------------------------------------------*/
function jsCopyTask() {
	return gulp.src(path.watch.js)
		.pipe(gulpif(argv.prod, jsmin()))
		.pipe(gulp.dest(path.dist.js));
}

gulp.task('javascript:copy', jsCopyTask);

gulp.task('javascript:copy-watch', function() {
	watch(path.watch.js, function() {
		jsCopyTask().pipe(browserSync.stream());
	});
});


/*--------------------------------------------------------
| CSS copy
--------------------------------------------------------*/
function cssCopyTask() {
	return gulp.src(path.watch.css)
		.pipe(autoprefixer({
			browsers: config.autoprefixer
		}))
		.pipe(gulpif(argv.prod, minifyCss()))
		.pipe(gulp.dest(path.dist.css));
}

gulp.task('css:copy', cssCopyTask);

gulp.task('css:copy-watch', function() {
	watch(path.watch.css, function() {
		cssCopyTask().pipe(browserSync.stream());
	});
});


/*--------------------------------------------------------
| Images copy
--------------------------------------------------------*/
function imagesCopyTask() {
	return gulp.src(path.watch.images)
		.pipe(gulp.dest(path.dist.images));
}

gulp.task('images:copy', imagesCopyTask);


/*--------------------------------------------------------
| Fonts
--------------------------------------------------------*/
function fontsTask() {
	return gulp.src(path.watch.fonts)
		.pipe(gulp.dest(path.dist.fonts));
}

gulp.task('fonts', fontsTask);


/*--------------------------------------------------------
| Extra files
--------------------------------------------------------*/
function extrasTask() {
	return gulp.src(path.watch.extras)
		.pipe(gulp.dest(config.distBase));
}

gulp.task('extras', extrasTask);


/*--------------------------------------------------------
| Tinypng
--------------------------------------------------------*/
gulp.task('images:tinypng', function () {
	return gulp.src(path.watch.distImages)
		.pipe(tinypng({
			key: config.tinypngApiKey,
			log: true
		}))
		.pipe(gulp.dest(path.dist.images));
});


/*--------------------------------------------------------
| Clear dist
--------------------------------------------------------*/
gulp.task('clear', function() {
	if (argv.noimg) {
		return del([
			config.sassCache,
			config.distBase + '/**/*',
			'!' + config.distBase + '/images',
			'!' + config.distBase + '/images/**/*'
		]);
	}

	return del([config.sassCache, config.distBase]);
});


/*--------------------------------------------------------
| Build dist
--------------------------------------------------------*/
var javascriptTask = Object.keys(concatJsFiles).length ? 'javascript:concat' : 'javascript:copy';
var cssTask = Object.keys(concatCssFiles).length ? 'css:concat' : 'css:copy';

gulp.task('build', function() {
	runSequence(
		'clear',
		['fonts', 'images:copy', javascriptTask, cssTask, 'jade', 'extras'],
		'compass'
	);
});


/*--------------------------------------------------------
| Develop dist
--------------------------------------------------------*/
gulp.task('default', [javascriptTask + '-watch', cssTask + '-watch'], function() {
	browserSync.init({
		server: config.distBase
	});

	watch(path.watch.jade, function() {
		jadeTask().pipe(browserSync.reload({stream:true}));
	});

	watch(path.watch.scss, function() {
		compassTask().pipe(browserSync.stream());
	});

	watch(path.watch.images, imagesCopyTask);
	watch(path.watch.fonts, fontsTask);
	watch(path.watch.extras, extrasTask);
});
