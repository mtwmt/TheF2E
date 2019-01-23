'use strict';

var gulp          = require('gulp');
var plumber       = require('gulp-plumber');
var sass          = require('gulp-sass');
var autoprefixer  = require('gulp-autoprefixer');
var sourcemaps    = require('gulp-sourcemaps');
var babel         = require('gulp-babel');
// 要加裝 babel-preset-es2015
var prettify      = require('gulp-prettify');
// var browserSync   = require("browser-sync").create();


gulp.task('css',function(){
  var scss = gulp.src('sourse/scss/*.scss')
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe( sass({ 
          outputStyle:'compact',
          includePaths: ['']
        }).on('error',sass.logError))
      .pipe(autoprefixer())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('public/css'));
  return scss;
});

gulp.task('js',function(){
  gulp.src('sourse/js/*.js')
      .pipe(plumber())
      .pipe(babel({
        presets: ['es2015']
      }))
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(gulp.dest('public/js'));
});

gulp.task('html', function() {
  var build = gulp.src(['sourse/*.html','sourse/**/*.html'])
      .pipe(plumber())
      .pipe(prettify({indent_size: 2}))
      .pipe(gulp.dest('public'));
  return build;
});


gulp.task('watch',function(){
  gulp.watch('sourse/scss/*.scss',['css']);
  gulp.watch('sourse/js/*.js',['js']);
  gulp.watch(['sourse/*.html','sourse/**/*.html'],['html']);
});
