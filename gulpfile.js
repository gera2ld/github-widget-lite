const fs = require('fs');
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const less = require('gulp-less');
const PluginCleanCss = require('less-plugin-clean-css');
const PluginAutoPrefix = require('less-plugin-autoprefix');
const PluginInlineURLs = require('less-plugin-inline-urls');
const cleanCss = new PluginCleanCss({advanced: true});
const autoPrefix = new PluginAutoPrefix();
const css2js = require('gulp-css-to-js');
const merge2 = require('merge2');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const del = require('del');
const minify = require('html-minifier').minify;
const wrap = require('gulp-wrap');

gulp.task('clean', () => del(['dist']));

gulp.task('build', () => {
  const assets = {
    TEMPLATE: minify(fs.readFileSync('src/template.html', {encoding: 'utf8'}), {
      removeComments: true,
      removeAttributeQuotes: true,
      collapseWhitespace: true,
    }),
  };
  return merge2([
    gulp.src('src/*.js')
    .pipe(replace(/__RPL_(\w+)__/g, (m, g) => JSON.stringify(assets[g] || ''))),
    gulp.src('src/*.less')
    .pipe(less({
      plugins: [cleanCss, autoPrefix, PluginInlineURLs],
    }))
    .pipe(css2js()),
  ])
  .pipe(concat('github-widget.js'))
  .pipe(wrap('!function(){\n<%=contents%>\n}();'))
  .pipe(gulp.dest('dist'))
  .pipe(uglify())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('dist'));
});
