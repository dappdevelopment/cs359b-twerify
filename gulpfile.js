var browserify = require('browserify'),
    watchify = require('watchify'),
    gulp = require('gulp'),
    source = require('vinyl-source-stream'),
    sourceFile = './app/public/js/app.js',
    destFolder = './app/public/js/',
    destFile = 'bundle.js';

gulp.task('browserify', function() {
  return browserify(sourceFile)
  .bundle()
  .pipe(source(destFile))
  .pipe(gulp.dest(destFolder));
});

gulp.task('watch', function() {
  var bundler = watchify(sourceFile);
  bundler.on('update', rebundle);

  function rebundle() {
    return bundler.bundle()
      .pipe(source(destFile))
      .pipe(gulp.dest(destFolder));
  }

  return rebundle();
});

gulp.task('default', ['browserify', 'watch']);