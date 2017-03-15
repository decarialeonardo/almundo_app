const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const sass = require('gulp-sass');
const pug = require('gulp-pug');
const uglify = require('gulp-uglify');
const pump = require('pump');

/**
 * Gulp Tasks
 */

gulp.task('nodemon', () => {
  var called = false;
  return nodemon({
    script: 'server/app.js',
    ignore: [
      'gulpfile.js',
      'node_modules/'
    ]
  });
});

gulp.task('sass', function () {
  return gulp.src('public/scss/**/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('public/css'));
});

gulp.task('sass:watch', function () {
  gulp.watch('public/scss/**/*.scss', ['sass']);
});

gulp.task('convertPugToHTML', function buildHTML() {
  return gulp.src('public/js/**/*.pug')
    .pipe(pug({
      // Your options in here.
    }))
    .pipe(gulp.dest('public/js'));
});

gulp.task('compress', function (cb) {
  pump([
        gulp.src('public/*.js'),
        uglify(),
        gulp.dest('dist')
    ],
    cb
  );
});

gulp.task('default', ['nodemon','convertPugToHTML', 'sass','sass:watch']);
