// ##### Gulp Toolkit for the jschol app #####

const _ = require('lodash');
const del = require('del');
const gulp = require('gulp');
const gutil = require('gulp-util');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const assets = require('postcss-assets');
const livereload = require('gulp-livereload')
const spawn = require('child_process').spawn
const webpack = require('webpack');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');

// Process control for Sinatra and Express
var sinatraProc // Main app in Sinatra (Ruby)
var expressProc // Sub-app for isomophic javascript in Express (Node/Javascript)

// Build javscript bundles with Webpack
gulp.task('watch:src', (cb) => {
  const config = Object.create(require('./webpack.conf.js'));
  config.watch = true;
  config.cache = true;
  config.bail = false;
  config.plugins.push(new ProgressPlugin( (percent, message) => 
    process.stdout.write(" [" + Math.round(percent*100) + "%] " + message + "                                \r")
  ))

  webpack(config, function(error, stats) {
    if (error) {
      gutil.log('[webpack]', error);
    }
    showSummary(stats);
    livereload.reload()
  });
});

function showSummary(stats) {
    gutil.log('[webpack]', stats.toString({
        colors: gutil.colors.supportsColor,
        hash: false,
        timings: false,
        chunks: false,
        chunkModules: false,
        modules: false,
        children: true,
        version: true,
        cached: false,
        cachedAssets: false,
        reasons: false,
        source: false,
        errorDetails: false
    }));
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// read package.json and get dependencies' package ids
function getNPMPackageIds() {
  var packageManifest = {};
  try {
    packageManifest = require('./package.json');
  } catch (e) {
    // does not have a package.json manifest
  }
  return _.keys(packageManifest.dependencies) || [];
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// Process Sass to CSS, add sourcemaps, autoprefix CSS selectors, optionally Base64 font and 
// image files into CSS, and reload browser:
gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      flexbox: ['no-2009'],
      grid: false // don't prefix any properties from old grid spec since not all new grid properties correlate with old grid spec still used by IE
    }))
    .pipe(postcss([assets({
      loadPaths: ['fonts/', 'images/']
    })]))
    .pipe(sourcemaps.write('sourcemaps'))
    .pipe(gulp.dest('app/css'))
    .pipe(livereload())
})

///////////////////////////////////////////////////////////////////////////////////////////////////
// Support functions for starting and restarting Sinatra (server for the main Ruby app)
function startSinatra(afterFunc)
{
  // The '-o 0.0.0.0' below is required for Sinatra to bind to ipv4 localhost, instead of ipv6 localhost
  sinatraProc = spawn('ruby', ['app/server.rb', '-p', '4001', '-o', '0.0.0.0'], { stdio: 'inherit' })
  sinatraProc.on('exit', function(code) {
    sinatraProc = null
  })
}

function restartSinatra()
{
  if (sinatraProc) {
    console.log("Restarting Sinatra.")
    sinatraProc.on('exit', function(code) {
      startSinatra()
      spawn('ruby', ['tools/waitForServer.rb', 'http://localhost:4001/check', '20'])
      .on('exit', function() {
        livereload.reload()
      })
    })
    sinatraProc.kill()
    sinatraProc = null
  }
  else {
    startSinatra()
  }
}

gulp.task('restart-sinatra', restartSinatra)

gulp.task('start-sinatra', restartSinatra)

///////////////////////////////////////////////////////////////////////////////////////////////////
// Support functions for starting and restarting Express, which runs the isomorphic-js sub-app.
function startExpress()
{
  expressProc = spawn('node', ['app/isomorphic.js'], { stdio: 'inherit' })
  expressProc.on('exit', function(code) {
    expressProc = null
  })
}

function restartExpress() {
  if (expressProc) {
    console.log("Restarting Express.")
    expressProc.on('exit', function(code) {
      startExpress()
    })
    expressProc.kill()
    expressProc = null
  }
  else {
    startExpress()
  }
}

gulp.task('restart-express', restartExpress)

gulp.task('start-express', restartExpress)

///////////////////////////////////////////////////////////////////////////////////////////////////
// Watch sass, html, and js and reload browser if any changes
gulp.task('watch', function() {
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/**/*.html', livereload.reload);
  gulp.watch('app/*.rb', ['restart-sinatra']);
  gulp.watch(['app/isomorphic.js*'], ['restart-express']);
});

///////////////////////////////////////////////////////////////////////////////////////////////////
gulp.task('livereload', function() {
  livereload.listen();
});

gulp.task('maybe-socks', function() {
  var socksProc = spawn('ruby', ['tools/maybeSocks.rb'], { stdio: 'inherit' })
});

///////////////////////////////////////////////////////////////////////////////////////////////////
// Build everything in order, then start the servers and watch for incremental changes.
gulp.task('default',  ['watch:src', 'watch', 'start-sinatra', 'start-express', 
                       'maybe-socks', 'livereload', 'sass'])
