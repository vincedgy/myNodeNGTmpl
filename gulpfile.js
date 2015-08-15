/* jshint camelcase:false */
'use strict';

var gulp = require('gulp'),
  sass = require('gulp-ruby-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  minifycss = require('gulp-minify-css'),
  jshint = require('gulp-jshint'),
  uglify = require('gulp-uglify'),
  imagemin = require('gulp-imagemin'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  notify = require('gulp-notify'),
  cache = require('gulp-cache'),
  livereload = require('gulp-livereload'),
  nodemon = require('gulp-nodemon'),
  typescript = require('gulp-typescript'),
  minifyHTML = require('gulp-minify-html'),
  ngAnnotate = require('gulp-ng-annotate'),
  del = require('del'),
  rename = require('gulp-rename');

// JSHint task
gulp.task('lint', function() {
  gulp
    .src(['src/js/*.js', '!src/bower_components/**/*.js'])
    .pipe(jshint())
    // You can look into pretty reporters as well, but that's another story
    .pipe(jshint.reporter('default'))
    .pipe(notify({
      message: 'lint task complete'
    }));
});

// TypeScript task
gulp.task('typescript', function() {
  var tsResult = gulp.src(['src/**/*.ts', '!src/bower_components/**/*.ts'])
    .pipe(typescript({
      noImplicitAny: true,
      out: 'compiled.js'
    }));
  return tsResult.js.pipe(gulp.dest('src/compiled.js'))
    .pipe(notify({
      message: 'TypeScript task complete'
    }));
});

// Clean
gulp.task('clean', function(cb) {
  return del(['public/assets/api', 'public/assets/css', 'public/assets/js', 'public/assets/img', 'index.html'], cb);
});

// Images
gulp.task('images', function() {
  return gulp.src('src/img/**/*')
    .pipe(cache(imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('public/assets/img'))
    .pipe(notify({
      message: 'Images task complete'
    }));
});

gulp.task('styles', function() {
  return sass('src/css/styles.scss', {
      style: 'expanded'
    })
    .pipe(autoprefixer('last 2 version'))
    .pipe(minifycss())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('public/assets/css'))
    .pipe(notify({
      message: 'Styles task complete'
    }));
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src(['src/*.js', 'src/js/*.js', 'src/js/**/*.js', '!src/bower_components/**/*js'])
    //.pipe(ngAnnotate)
    .pipe(uglify())
    .pipe(concat('main.js'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('public/assets/js'))
    .pipe(notify({
      message: 'Scripts task complete'
    }));
});

// build-api
gulp.task('build-api', function() {
  return gulp.src(['src/api/**/*.min.js', 'src/api/**/release/*.min.js', 'src/api/**/dist/*.min.js'])
    .pipe(concat('api.js'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('public/assets/api'))
    .pipe(notify({
      message: 'build-api task complete'
    }));
});

// build-api maps
gulp.task('build-api-map', function() {
  return gulp.src(['src/api/**/*.min.js.map', 'src/api/**/release/*.min.js.map', 'src/api/**/dist/*.min.js.map'])
    .pipe(rename({dirname: 'public/assets/api'}))
    .pipe(gulp.dest('./'))
    .pipe(notify({
      message: 'build-api-map task complete'
    }));
});


gulp.task('start', function() {
  return nodemon({
    script: 'server.js',
    ext: 'js html',
    env: {
      'NODE_ENV': 'development'
    }
  })
  .pipe(notify({
    message: 'start task complete'
  }));
});

gulp.task('minify-html', function() {
  var opts = {
    conditionals: true,
    spare: true
  };
  return gulp.src(['./src/templates/*.html', './src/index.html'])
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest('./public/'))
    .pipe(notify({
      message: 'minify-html task complete'
    }));
});

// Watch
gulp.task('watch', function() {
  // Watch .scss files
  gulp.watch('src/css/**/*.scss', ['styles']);
  // Watch .ts files
  // gulp.watch(['src/js/**/*.ts','!src/bower_components/**/*.ts'], ['typescript']);
  // Watch .js files
  gulp.watch(['src/js/**/*.js', 'src/app.js', 'src/compiled.js'], ['lint', 'scripts']);
  // Watch image files
  gulp.watch('src/img/**/*', ['images']);
  // Watch index.html
  gulp.watch(['./src/templates/*.html', './src/index.html'], ['minify-html']);
  // Create LiveReload server
  livereload.listen();
  // Watch any files in public/, reload on change and restart server
  gulp.watch(['public/**/*', 'public/*']).on('change', livereload.changed)
});

// Default task
gulp.task('default', ['clean'], function() {
  gulp.start('styles', 'build-api', 'build-api-map', 'scripts', 'images', 'minify-html', 'watch');
});
