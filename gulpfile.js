"use strict";

const gulp = require("gulp");
const sass = require("gulp-sass");
const watch = require("gulp-watch");
const plumber = require("gulp-plumber");
const ejs = require("gulp-ejs");
const rename = require("gulp-rename");
const browserSync = require("browser-sync").create();
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");


/*
 * config
 */
const CONFIG = {
  watchFiles: {
    html: "src/**/*.html",
    css: "src/**/*.css",
    sass: "src/**/*.scss",
    js: "src/**/*.js",
    jpg: "src/**/*.jpg",
    png: "src/**/*.png",
    gif: "src/**/*.gif",
    svg: "src/**/*.svg",
    ejs: "src/**/*.ejs"
  },
  directory: {
    dev: "src",
    release: "dist"
  }
};

/*
 * copy html, js, css files
 */
gulp.task("copy", function() {
  return gulp
    .src(
      [CONFIG.watchFiles.html, CONFIG.watchFiles.js, CONFIG.watchFiles.css],
      { base: CONFIG.directory.dev }
    )
    .pipe(gulp.dest(CONFIG.directory.release));
});

/**
 * compile ejs
 */
gulp.task("ejs", function() {
  return gulp
    .src([CONFIG.watchFiles.ejs, "!" + "src/**/_*.ejs"], {
      base: CONFIG.directory.dev
    })
    .pipe(plumber())
    .pipe(ejs())
    .pipe(rename({ extname: ".html" }))
    .pipe(gulp.dest(CONFIG.directory.release));
});

/*
 * copy image files
 */
gulp.task("copy_images", function() {
  return gulp
    .src(
      [
        CONFIG.watchFiles.jpg,
        CONFIG.watchFiles.png,
        CONFIG.watchFiles.gif,
        CONFIG.watchFiles.svg
      ],
      { base: CONFIG.directory.dev }
    )
    .pipe(gulp.dest(CONFIG.directory.release));
});

/*
 * compile sass
 */
gulp.task("sass", function() {
  return gulp
    .src(CONFIG.watchFiles.sass, {
      base: CONFIG.directory.dev,
      sourcemaps: true
    })
    .pipe(plumber())
    .pipe(sass({ outputStyle: "expanded" })) //nested, compact, expanded, compressed
    .pipe(postcss([
      autoprefixer({
        cascade: false
      })
    ]))
    .pipe(gulp.dest(CONFIG.directory.release, { sourcemaps: "./maps" }));
});

/*
 * watch
 */
gulp.task("watch", function(done) {
  console.log("in watch");

  watch(CONFIG.watchFiles.sass, gulp.parallel("sass", "reload"));
  watch(CONFIG.watchFiles.ejs, gulp.parallel("ejs", "reload"));
  watch(
    [CONFIG.watchFiles.html, CONFIG.watchFiles.js, CONFIG.watchFiles.css],
    gulp.parallel("copy", "reload")
  );
  watch(
    [
      CONFIG.watchFiles.jpg,
      CONFIG.watchFiles.png,
      CONFIG.watchFiles.gif,
      CONFIG.watchFiles.svg
    ],
    gulp.parallel("copy_images", "reload")
  );
});

/*
 * browser-sync
 */
gulp.task("browser-sync", function(done) {
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

gulp.task("reload", function(done) {
  browserSync.reload();
  done();
});

gulp.task("compile", gulp.series("copy", "copy_images", "sass", "ejs"));

gulp.task(
  "default",
  gulp.series("copy", "copy_images", "sass", "ejs", "browser-sync", "watch")
);
