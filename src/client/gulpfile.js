var gulp = require('gulp');
var minify = require('gulp-minify');
var concat = require('gulp-concat');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var jshint = require('gulp-jshint');
var order = require('gulp-order');
var wrap = require('gulp-wrap');
var webserver = require('gulp-webserver');
var del = require('del');
var fs = require('fs');
var template = require('gulp-template');

var env = process.env.MPS_ENV;
if(env === undefined) env = "dev";

gulp.task('scripts', ['libs'], function(){
  return gulp.src(['app/**/module.js','app/**/*.js', 'app.js'])
    .pipe(jshint())
    .pipe(concat('mps.app.js'))
    //.pipe(minify())
    .pipe(wrap('define([\'mps.app\',\'lxk.fef\'], function() {<%= contents %>});'))
    .pipe(gulp.dest('dist/build'));
});

gulp.task('libs', function() {
  /*
    Order determines how they are ordered in library file
  */
  return gulp.src([
        'libs/angular.min.js',
        'libs/angular-cookies.min.js',
        'libs/angular-gatekeeper.js',
        'libs/angular-resource.min.js',
        'libs/angular-route.min.js',
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
        'libs/ng-tags-input.min.js',
        'libs/pdfmake.min.js',
        'libs/vfs_fonts.js',
        'libs/ui-grid/3.0.6/ui-grid.min.js'
    ])
  .pipe(concat('mps.libs.js'))
  .pipe(wrap('define(\'mps.libs\', function() {<%= contents %>});'))
  .pipe(gulp.dest('dist/build'));
});


gulp.task('rome', function(){
  return gulp.src(['libs/rome.js'])
  .pipe(concat('rome.js'))
  .pipe(gulp.dest('dist/build'));
});


gulp.task('html-templates', function(){
  return gulp.src(['app/**/templates/*.html', 'app/**/templates/**/*.html'])
    .pipe(gulp.dest('dist/build/app'));
});

gulp.task('json-data', function(){
  return gulp.src(['app/**/data/*.json'])
    .pipe(gulp.dest('dist/build/app'));
});

gulp.task('favicon', function(){
  return gulp.src(['etc/*.ico'])
    .pipe(gulp.dest('dist/build/'));
});

gulp.task('less', function() {
  return gulp.src(['etc/styles/less/_build.less'])
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(concat('mps.app.css'))
    .pipe(gulp.dest('dist/build/css'));
});

gulp.task('third-party-styles', function(){
  return gulp.src(['etc/styles/css/*', 'etc/styles/css/*/*', 'etc/styles/css/*/*/*'])
    .pipe(gulp.dest('dist/build/css'));
});

gulp.task('lxk-styles', function(){
   return gulp.src(['etc/**/*','!etc/{styles,styles/**}'])
    .pipe(gulp.dest('dist/build/etc'));
});

gulp.task('prep-html', function() {
    // Read environment variable ENV for config file
    // dev, beta, etc.
    var json = JSON.parse(fs.readFileSync('./config/' + env + '.json'));
    return gulp.src(['views/index.html'])
        .pipe(template(json))
        .pipe(gulp.dest('dist/build'));
});


gulp.task('clean', function() {
    return del([
        'dist/build/**/*'
    ]);
});

// DEFAULT TASK //
// Be warned - task dependencies are run in *parallel*. If you need ordering, be sure sub-tasks properly define their
// dependencies
gulp.task('default', ['scripts', 'less', 'prep-html', 'libs', 'html-templates',
                      'json-data', 'third-party-styles', 'lxk-styles', 'rome','favicon']);

gulp.task('dev', ['default'], function(){

  // watch filesystem paths and dispatch tasks when changes are detected
  gulp.watch('app/**', ['scripts']);

  gulp.watch('libs/**', ['libs','rome']);

  gulp.watch('etc/styles/less/**/*.less', ['less']);

  gulp.watch('views/index.html', ['prep-html']);

  gulp.watch('app/**/templates/*.html', ['html-templates']);
  gulp.watch('app/**/templates/**/*.html', ['html-templates']);

    return gulp.src('dist/build/')
        .pipe(webserver({
            port: 8080,
            open: true,
           // livereload: true,
            fallback: '/index.html'
        }));
});
