const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const sass = require('gulp-sass');
const pug = require('gulp-pug');
const uglify = require('gulp-uglify');
const fs = require('fs');
const path = require('path');
const order = require('gulp-order');
const concat = require('gulp-concat');
const merge = require('merge-stream');

const getFolders = function(dir){
  return fs.readdirSync(dir)
    .filter((file) => {
      return fs.statSync(path.join(dir, file)).isDirectory();
    });
};


/**
 * Gulp Tasks
 */

gulp.task('package', () => {
  const folders = getFolders('public/js');
  const tasks = folders.map((folder) => {
    return gulp.src([path.join('public/js', folder, '/**/*.js')])
        .pipe(order(["**/*.module.js", "**/*.js"]))
        .pipe(concat(`${folder}-pkg.js`))
        .pipe(gulp.dest(path.join('public/js', folder)));
  });

  return merge(tasks);
});

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

gulp.task('default', ['nodemon','convertPugToHTML','package', 'sass','sass:watch']);
