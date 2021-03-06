var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;


var postcss = require('gulp-postcss');
var cssImport = require('postcss-import');
var mixins = require('postcss-mixins');
var simpleVars = require('postcss-simple-vars');
var nested = require('postcss-nested');
var autoprefixer = require('autoprefixer-core');
var cssnext = require('gulp-cssnext');
var mqpacker = require('css-mqpacker');
var cssnano = require('cssnano');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('css', function(){
  var processors = [
    cssImport,
    mixins,
    simpleVars,
    nested,
    autoprefixer({browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']}),
    mqpacker,
    cssnano
  ];
  return gulp.src('./src/css/*.css')
    .pipe(cssnext({compress: true }))
    .pipe(postcss(processors))
    .pipe(gulp.dest('./dist/css'));

});

// Static server
gulp.task('browser-sync', function(){
  browserSync({
    server: {
      baseDir: "./"
    }
  });
});

// Concatenate & Minify
gulp.task('scripts', function(){
  return gulp.src('./src/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('dist/js'))
    .pipe(reload({stream:true}));
});

// Watch
gulp.task('watch', function(){
  gulp.watch('./src/**/*.css', ['css', browserSync.reload]);
  
  gulp.watch(['./src/**/*.js', 'main.js'], ['scripts', browserSync.reload]);

  gulp.watch('*.html', browserSync.reload);
});


gulp.task('default', ['css', 'browser-sync', 'scripts', 'watch']);
