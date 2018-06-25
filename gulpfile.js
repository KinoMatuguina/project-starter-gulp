"use strict";

const gulp = require('gulp');
const browserSync = require('browser-sync').create()
const sass = require('gulp-sass');
const pug = require('gulp-pug');
const gulpCopy = require('gulp-copy');
const imagemin = require('gulp-imagemin');
const plumber = require('gulp-plumber');
const concat = require('gulp-concat');
const jshint = require('gulp-jshint');
const uglify = require('gulp-uglify');

const src = {
    "sass": "./src/assets/styles/sass/*.scss",
    "images": "./src/assets/images/**",
    "scripts": "./src/assets/scripts/master.js",    
    "templates": "./src/templates/*.pug",
    "index": "./src"
};

const dist = {
    "sass": "./dist/assets/css",
    "images": "./dist/assets/images/",
    "scripts": "./dist/assets/scripts/",
    "index": "./dist"
};

gulp.task('hot-reload', function() {
    browserSync.reload(function() {
        console.log('reloading files')
    });
});

gulp.task('sass', function createSass() {
    return gulp.src(src.sass)
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest(dist.sass))
            .pipe(browserSync.stream());
});

gulp.task('serve', function serve() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });

    gulp.src(src.images).pipe(imagemin()).pipe(gulp.dest('./dist/assets/images'))
});


gulp.task('pug',function() {
    return gulp.src(src.templates)
    .pipe(pug({
       doctype: 'html',
       pretty: true
    }))
    .pipe(gulp.dest(dist.index))
    .pipe(browserSync.stream());
});

gulp.task('minify-image', function minifyImages() {
    return gulp.src(src.images)
    .pipe(imagemin())
    .pipe(gulp.dest('./dist/assets/images'))
    .pipe(browserSync.stream());
})

gulp.task('scripts', function(){
	gulp.src(src.scripts)
		.pipe(plumber({
			errorHandler: function (error) {
                console.log(error)
				this.emit('end');
		}}))
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(concat('master.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(dist.scripts))
		.pipe(browserSync.stream());
});



gulp.task(
    'default', /*   default task to run     */
    ['serve'], /*   assign task to serve    */ 
    function createDefault() {    /*   callback after runing the default task    */ 
        gulp.watch("./src/*.html", ['hot-reload']); /* watching all html file and run the callbaack hot-reload function */
        gulp.watch(src.sass, ['sass']);
        gulp.watch(src.templates, ["pug"]);
        gulp.watch(src.images, ['minify-image']);
        gulp.watch(src.scripts, ['scripts']);
    }
);