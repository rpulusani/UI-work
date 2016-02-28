var gulp = require('gulp');
var minify = require('gulp-minify');
var concat = require('gulp-concat');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var jshint = require('gulp-jshint');
var order = require('gulp-order');

gulp.task('scripts', function(){
  return gulp.src(['app/**/*.js', 'app.js'])
    .pipe(jshint())
//    .pipe(minify())
    .pipe(concat('mps.app.js'))
    .pipe(gulp.dest('dist/build'));
});

gulp.task('libs', function() {
  /*
    Order determines how they are ordered in library file
  */
  return gulp.src([
        'libs/angular.min.js',
        'libs/angular-resource.min.js',
        'libs/angular-route.min.js',
        'libs/angular-cookies.min.js',
        'libs/angular-sanitize.min.js',
        'libs/angular-spring-data-rest.min.js',
        'libs/angular-translate.min.js',
        'libs/angular-translate-loader-url.min.js',
        'libs/angular-translate-loader-static-files.min.js',
        'libs/angular-translate-storage-cookie.min.js',
        'libs/angular-translate-storage-local.min.js',        
        'libs/blob.js',
        'libs/v-button.min.js',
        'libs/ng-google-chart.js',
        'libs/ng-tag-input.min.js',
        'libs/pdfmake.min.js',
        'libs/vfs_fonts.js',
        'libs/rome.min.js',
        'libs/ui-grid/3.0.6/ui-grid.min.js'
    ])
  .pipe(concat('mps.libs.js'))
  .pipe(gulp.dest('dist/build'));
})

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

// DEFAULT TASK //
gulp.task('default', function() {
  gulp.run('scripts', 'styles', 'prep-html', 'libs');

  gulp.watch('app/**', function(event) {
    gulp.run('scripts');
  });

  gulp.watch('libs/**', function(event) {
    gulp.run('libs');
  })

  gulp.watch('views/index.html', function(event) {
    gulp.run('prep-html');
  })
})
