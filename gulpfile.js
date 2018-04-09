'use strict';

var gulp = require('gulp');
var inject = require('gulp-inject');

gulp.task('inject', function(){
   var target = gulp.src('./index.html');
    var sources = gulp.src(['./node_modules/materialize-css/dist/css/materialize.min.css',
                            './css/styles.css',
                            './node_modules/angular/angular.min.js',
                            './node_modules/jquery/dist/jquery.min.js',
                            './node_modules/materialize-css/dist/js/materialize.min.js',
                            './scripts/scripts.js'
                           ],{read: false});
    
    return target.pipe(inject(sources))
        .pipe(gulp.dest('./'));
});