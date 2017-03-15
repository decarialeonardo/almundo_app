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
const templateCache = require('gulp-angular-templatecache');
const gulpsync = require('gulp-sync')(gulp);


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
    return gulp.src([path.join('public/js', folder, '/**/*.js'), "!public/js/**/*-pkg.js"])
        .pipe(order(["**/*.module.js", "**/*.js"]))
        .pipe(concat(`${folder}-pkg.js`))
        .pipe(gulp.dest(path.join('public/js', folder)));
  });

  return merge(tasks);
});

gulp.task('template-cache', () =>{
  return gulp.src('public/js/**/*.html')
    .pipe(templateCache('app.template.js',{
      module: 'App',
      templateHeader: '(function() { angular.module("<%= module %>"<%= standalone %>).run(["$templateCache", function($templateCache) {',
      templateFooter: '}])})();'
    }))
    .pipe(gulp.dest('public/js/app'))
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

gulp.task('sass', () => {
  return gulp.src('public/scss/**/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('public/css'));
});

gulp.task('convertPugToHTML', function buildHTML() {
  return gulp.src('public/js/**/*.pug')
    .pipe(pug({
      // Your options in here.
    }))
    .pipe(gulp.dest('public/js'));
});

gulp.task('watch', () => {
	gulp.watch(['public/scss/**/*.scss'], ['sass']);
	gulp.watch(['public/js/**/*.js', '!public/js/**/*pkg*.js'], ['package']);
	gulp.watch(['public/js/**/*.pug', '!./public/js/**/*.html'], gulpsync.sync(['convertPugToHTML','template-cache']));
});

gulp.task('default', gulpsync.sync(['nodemon', 'template-cache', 'convertPugToHTML', 'package', 'sass', 'watch']));
