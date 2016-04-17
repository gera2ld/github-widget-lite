const fs = require('fs');
const gulp = require('gulp');
const merge2 = require('merge2');
const replace = require('gulp-replace');
const wrap = require('gulp-wrap');
const less = require('gulp-less');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const css2js = require('gulp-css2js');
const concat = require('gulp-concat');
const minify = require('html-minifier').minify;

gulp.task('demo', () => {
  return gulp.src('scripts/index.html')
  .pipe(gulp.dest('dist'));
});

gulp.task('assets', () => {
  const assets = {
    TEMPLATE: minify(fs.readFileSync('src/template.html', {encoding: 'utf8'}), {
      removeComments: true,
      removeAttributeQuotes: true,
      collapseWhitespace: true,
    }),
  };
  return merge2([
    gulp.src('src/*.js')
    .pipe(replace(/__RPL_(\w+)__/g, (m, g) => JSON.stringify(assets[g] || '')))
    .pipe(wrap('!function(){\n<%=contents%>\n}();')),
    gulp.src('src/*.less')
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(cssnano())
    .pipe(css2js())
  ])
  .pipe(concat('github-widget.js'))
  .pipe(gulp.dest('dist'));
});

gulp.task('build', ['demo', 'assets']);
