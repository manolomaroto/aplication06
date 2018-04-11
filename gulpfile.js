'use strict';

var gulp = require('gulp');
var inject = require('gulp-inject');
var useref = require('gulp-useref');
var gulpIf = require('gulp-if');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var cssnano = require('gulp-cssnano');
var ignore = require('gulp-ignore');
var jshint = require('gulp-jshint');
/*var eslint = require('gulp-eslint');*/
var jscs = require('gulp-jscs');
var runSequence = require('run-sequence');
var del = require('del');
var watch = require('gulp-watch');
var connect = require('gulp-connect');


gulp.task('inject', function(){
   var target = gulp.src('./index.html');
    var sources = gulp.src(['./css/styles.css',
                            './scripts/scripts.js'
                           ],{read: false});
    
    return target.pipe(inject(sources))
        .pipe(gulp.dest('./'));
});

gulp.task('compress',['inject'], function(){
    return gulp.src('./index.html')
        .pipe(useref())
        .pipe(gulpIf('**/*.js',uglify({
            mangle: true
        })
        .on('error', gutil.log)))
        .pipe(gulpIf('**/*.css', cssnano()))
    
        .pipe(gulp.dest('./dist'));
});

gulp.task('copy:assets', function(){
    return gulp.src('./assets*/**')
        .pipe(gulp.dest('./dist'));
});

gulp.task('jshint', function(){
    return gulp.src('./scripts/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

/*gulp.task('eslint',() => {
    return gulp.src('./scripts/*.js')
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});*/

gulp.task('jscs', function(){
    return gulp.src('./scripts/*.js')
        .pipe(jscs())
        .pipe(jscs.reporter())
        .pipe(jscs.reporter('fail'));
});

gulp.task('clean:dist', () => {
    return del('./dist/**/*');
});

gulp.task('watch', () => {
    gulp.watch('./css/*.css', ['inject']);
    gulp.watch('./scripts/*.js', ['jshint', 'jscs', 'inject']);
    gulp.watch('./index.html', function (event) {
    gulp.src(event.path)
      .pipe(connect.reload());
  });
});

gulp.task('server', () => {
    connect.server({
        root: './',
        hostname: '0.0.0.0',
        port: 8080,
        livereload: true
    });
});

gulp.task('server-dist', ['build']), () => {
    connect.server({
        root: './dist',
        hostname: '0.0.0.0',
        port: 8080
    })
}

gulp.task('build',(done) => {
    runSequence('jshint', 'jscs', 'clean:dist', 'compress', 'copy:assets');
});

gulp.task('default', ['server', 'watch']);