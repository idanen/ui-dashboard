// Include Gulp & tools we'll use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var inject = require('gulp-inject');
var series = require('stream-series');
var isProd = require('yargs').argv.stage === 'prod';

var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

const JS_FILES_ORDER = [
  '**/firebase.js',
  '**/lodash.js',
  '**/dependencies/**/moment.js',
  '**/dependencies/**/jquery*.js',
  '**/dependencies/**/bootstrap.js',
  '**/dependencies/**/angular.js',
  '**/clipboard.js',
  '**/spin.js',
  '**/ladda.js',
  '**/angular-ui-bootstrap/**/ui-bootstrap.js'
];

// Lint JavaScript
gulp.task('jshint', function () {
  return gulp.src('src/client/js/**/*.js')
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

// Optimize images
gulp.task('images', function () {
  return gulp.src('src/client/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
    .pipe($.size({title: 'images'}));
});

// Copy all files at the root level (src/client)
gulp.task('copy', function () {
  return gulp.src([
    'src/client/components/**/*.*'/*,
    '!src/client/*.html',
    'node_modules/apache-server-configs/dist/.htaccess'*/
  ], {
    dot: true
  }).pipe(gulp.dest('dist/components'))
    .pipe($.size({title: 'copy'}));
});

// Copy web fonts to dist
gulp.task('fonts', function () {
  return gulp.src(['src/client/**/fonts/**'])
    .pipe(gulp.dest('dist/fonts'))
    .pipe($.size({title: 'fonts'}));
});

// Compile and automatically prefix stylesheets
gulp.task('styles', function () {
  var mainCssFilter = $.filter('styles*.css', {restore: true});
  // For best performance, don't add Sass partials to `gulp.src`
  return gulp.src([
    'src/client/lib/**/*.{scss,css}',
    'src/client/css/**/*.{scss,css}',
    '!src/client/css/ci-status/**'
  ])
    .pipe($.sourcemaps.init())
    .pipe($.changed('.tmp/css', {extension: '.css'}))
    .pipe($.sass({
      precision: 10,
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/css'))
    // Concatenate and minify styles
    .pipe($.if('*.css', $.csso()))
    .pipe($.if(isProd, mainCssFilter))
    .pipe($.if(isProd, $.rev()))
    .pipe($.if(isProd, mainCssFilter.restore))
    .pipe(gulp.dest('dist/css'))
    .pipe($.size({title: 'styles'}));
});

// Concatenate and minify JavaScript. Optionally transpiles ES2015 code to ES5.
// to enables ES2015 support remove the line `"only": "gulpfile.babel.js",` in the
// `.babelrc` file.
gulp.task('scripts', ['jslib', 'jshint'], function () {
  return gulp.src([
    // Note: Since we are not using useref in the scripts build pipeline,
    //       you need to explicitly list your scripts here in the right order
    //       to be correctly concatenated
    './src/client/js/**/*.js'
    // Other scripts
  ])
      .pipe($.newer('.tmp/scripts'))
      .pipe($.sourcemaps.init())
      .pipe($.babel({
        presets: ['es2015']
      }))
      .pipe($.sourcemaps.write())
      .pipe($.if(isProd, $.concat('main.min.js')))
      .pipe($.if(isProd, $.uglify({preserveComments: 'some'})))
      .pipe($.if(isProd, $.rev()))
      .pipe(gulp.dest('dist/scripts'))
    // Output files
      .pipe($.size({title: 'scripts'}))
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest('dist/scripts'));
});

// Scan your HTML for assets & optimize them
gulp.task('html', ['scripts'], function () {
  var assets = $.useref.assets({searchPath: '{.tmp,src/client}'});

  return gulp.src([
    'src/client/**/*.html',
    '!src/client/js/**/*.html',
    'src/client/manifest.json',
    '!src/client/components/**/*.html'
  ])
    .pipe(assets)
    // Concatenate and minify JavaScript
    .pipe($.if('*.js', $.uglify({preserveComments: 'some'})))
    // Remove any unused CSS
    // Note: if not using the Style Guide, you can delete it from
    //       the next line to only include styles your project uses.
    .pipe($.if('*.css', $.uncss({
      html: [
        'src/client/index.html'
      ],
      // CSS Selectors for UnCSS to ignore
      ignore: [
        /.navdrawer-container.open/,
        /.app-bar.open/
      ]
    })))
    // Concatenate and minify styles
    // In case you are still using useref build blocks
    .pipe($.if('*.css', $.csso()))
    .pipe(assets.restore())
    .pipe($.useref())
    // Update production Style Guide paths
    .pipe($.replace('components/components.css', 'components/main.min.css'))
    // Output files
    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'html'}));
});

// Clear images cache
gulp.task('clear', function (done) {
  return $.cache.clearAll(done);
});

// Clean output directory
gulp.task('clean', del.bind(null, ['.tmp', 'dist/*', '!dist/.git'], {dot: true}));

gulp.task('jslib', function () {
  return gulp.src([
        'src/client/lib/**/*.js',
        '!**/*min.js'
      ])
      .pipe($.sourcemaps.init())
      // .pipe($.count('found ## pages'))
      .pipe($.order(JS_FILES_ORDER))
      .pipe($.if(isProd, $.concat('vendor.min.js')))
      .pipe($.if(isProd, $.uglify({preserveComments: 'some'})))
      .pipe($.if(isProd, $.rev()))
      .pipe(gulp.dest('dist/lib'))
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest('dist/lib'));
});

gulp.task('templatecopy', function () {
  return gulp.src(['src/client/js/**/*.html'])
      .pipe(gulp.dest('dist/js'));
});

// Inject app *.js files to index.html
gulp.task('inject', ['templatecopy', 'html'], function () {
  var scriptsSrc = 'dist/scripts/' + (isProd ? 'main*.min.js' : '**/*.js'),
      vendorSrc = 'dist/lib/' + (isProd ? 'vendor*.min.js' : '**/*.js'),
      stylesSrc = 'dist/css/styles*.css',
      mainJsStream, vendorJsStream;

  vendorJsStream = gulp.src([vendorSrc], {read: false})
      .pipe($.order(JS_FILES_ORDER));
  mainJsStream = gulp.src([scriptsSrc], {read: false});

  return gulp.src('dist/index.html')
    .pipe(inject(series(vendorJsStream, mainJsStream), {relative: true}))
    .pipe(inject(gulp.src(stylesSrc, {read: false}), {relative: true}))
    //.pipe($.angularFilesort())
    //// Minify any HTML
    //.pipe($.htmlmin({
    //  collapseWhitespace: true,
    //  removeComments: true
    //}))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', function (cb) {
  runSequence('clean', ['styles', 'copy', 'inject', 'images'], cb);
});

// Watch files for changes & reload
gulp.task('serve', ['build'], function () {
  browserSync({
    notify: false,
    // Customize the BrowserSync console logging prefix
    logPrefix: 'ci-dash',
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    //https: true,
    port: 3080,
    server: ['.tmp', 'dist']
  });

  gulp.watch(['src/client/**/*.html', 'src/client/js/**/*.js'], function () {
    runSequence('inject', reload);
  });
  gulp.watch(['src/client/**/*.{scss,css}'], function () {
    runSequence('styles', 'inject', reload);
  });
  gulp.watch(['src/client/images/**/*'], reload);
});

// Build and serve the output from the dist build
gulp.task('serve:dist', ['clear', 'build'], function () {
  browserSync({
    notify: false,
    logPrefix: 'dash',
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: 'dist'
  });
});

// Build production files, the default task
gulp.task('default', ['clear', 'clean'], function (cb) {
  runSequence('styles', ['jshint', 'html', 'images', 'fonts', 'copy'], 'inject', cb);
});

// watch files for changes and reload
// gulp.task('serve', function() {
//   browserSync({
//     server: {
//       baseDir: 'src/client'
//     }
//   });

//   gulp.watch(['*.html', 'css/**/*.css', 'js/**/*.js'], {cwd: 'src/client'}, reload);
// });
