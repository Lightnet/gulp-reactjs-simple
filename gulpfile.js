var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var gls = require('gulp-live-server');

const vendors = ['react', 'react-dom'];

gulp.task('build:vendor', () => {
  const b = browserify({
    debug: true
  });

  // require all libs specified in vendors array
  vendors.forEach(lib => {
    b.require(lib);
  });

  b.bundle()
  .pipe(source('vendor.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init({loadMaps: true}))
  .pipe(sourcemaps.write('./maps'))
  .pipe(gulp.dest('./dist/'))
  ;
});

gulp.task('build',['build:vendor'], function () {
    return browserify({entries: './app/app.jsx', extensions: ['.jsx'], debug: true})
        .external(vendors) // Specify all vendors as external source
        .transform('babelify', {presets: ['es2015', 'react']})
        .bundle()
        .pipe(source('./app/app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['build'], function () {
    gulp.watch('*.jsx', ['build']);
});

gulp.task('build:html', function() {
  return gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));
})

gulp.task('serve', function() {
  var server = gls.static('dist', 80);
  server.start();
});

gulp.task('default', ['serve','build:html','watch']);
