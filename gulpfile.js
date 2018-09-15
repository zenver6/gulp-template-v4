'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync').create();


/*
 * config
 */
var CONFIG = {
  watchFiles: {
    html : 'src/**/*.html',
    css  : 'src/**/*.css' ,
    sass : 'src/**/*.scss',
    js   : 'src/**/*.js',
    jpg  : 'src/**/*.jpg',
    png  : 'src/**/*.png',
    gif  : 'src/**/*.gif'
  },
  directory: {
    dev : 'src',
    release : 'dist'
  }
};

/*
 * copy html, js, css files
 */
gulp.task('copy', function(){
  return gulp.src([
    CONFIG.watchFiles.html,
    CONFIG.watchFiles.js,
    CONFIG.watchFiles.css], { base: CONFIG.directory.dev})
      .pipe(gulp.dest(CONFIG.directory.release));
});

/*
 * copy image files
 */
gulp.task('copy_images', function(){
  return gulp.src([
    CONFIG.watchFiles.jpg,
    CONFIG.watchFiles.png,
    CONFIG.watchFiles.gif], { base: CONFIG.directory.dev})
      .pipe(gulp.dest(CONFIG.directory.release))
});

/*
 * compile sass
 */
gulp.task('sass', function(){
  return gulp.src(CONFIG.watchFiles.sass, { base: CONFIG.directory.dev})
    .pipe(plumber())
    .pipe(sass({outputStyle : 'expanded'})) //nested, compact, expanded, compressed
    .pipe(gulp.dest(CONFIG.directory.release));
});

/*
 * watch
 */
gulp.task('watch', function(done){
  console.log('in watch');

  watch(
    CONFIG.watchFiles.sass,
    gulp.parallel('sass', 'reload')
    );
  watch([
    CONFIG.watchFiles.html,
    CONFIG.watchFiles.js,
    CONFIG.watchFiles.css],
    gulp.parallel('copy', 'reload')
    );
  watch([
    CONFIG.watchFiles.jpg,
    CONFIG.watchFiles.png,
    CONFIG.watchFiles.gif],
    gulp.parallel('copy_images', 'reload')
    );
});

/*
 * browser-sync
 */
gulp.task('browser-sync', function(done){
  browserSync.init({
    server: {
      baseDir: CONFIG.directory.release
    }
  });
  //reload monitoring
  // watch([
  //   CONFIG.directory.release + '/**/*'], function(event){
  //     gulp.parallel('reload');
  //   });

  done();
});

gulp.task('reload', function(done){
  browserSync.reload();
  done();
});


gulp.task('default', gulp.series('copy', 'copy_images', 'sass', 'browser-sync', 'watch'));
