var gulp = require('gulp');
var minify = require('gulp-minify');
var concat = require('gulp-concat');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var jshint = require('gulp-jshint');

gulp.task('scripts', function(){
  return gulp.src(['app/**/*.js', '!app/libs/**/*.js'])
    .pipe(jshint())
//    .pipe(minify())
    .pipe(concat('combined.js'))
    .pipe(gulp.dest('dist/build'));
});

gulp.task('styles', function() {
  return gulp.src(['etc/styles/css/less/**/*.less'])
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(gulp.dest('dist/build'));
});

gulp.task('prep-html', function() {
    return gulp.src(['views/index.html'])
    .pipe(gulp.dest('dist/build'));
});

gulp.task('default', function() {
  gulp.run('scripts', 'styles', 'prep-html');
/*
  gulp.watch('app/src/**', function(event) {
    gulp.run('scripts');
  })
  */
})
