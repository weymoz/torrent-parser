const { src, dest, watch, series, parallel } = require("gulp");
const browserSync = require("browser-sync").create();
const sourcemaps = require('gulp-sourcemaps');
const sass = require("gulp-sass");
const babel = require('gulp-babel');
const del = require("del");
const nodemon = require("gulp-nodemon");

const PUBLIC_FOLDER = './server/public';
const STYLES_FOLDER = './server/scss';
const SCRIPTS_FOLDER = './server/js';

sass.compiler = require("node-sass");


function styles() {
  return src(STYLES_FOLDER + '/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(dest(PUBLIC_FOLDER))
    .pipe(browserSync.reload({stream: true}));
}

function watchStyles(cb) {
  watch(STYLES_FOLDER, styles);
  cb();
}

function scripts() {
  return src('./server/js/*.js')
    .pipe(babel())
    .pipe(dest(PUBLIC_FOLDER));
}

function watchScripts(cb) {
  watch(SCRIPTS_FOLDER, series(scripts, browserSync.reload));
  cb();
}

function clean() {
  return del([PUBLIC_FOLDER]);
}

function startBrowserSync(cb){
  browserSync.init(null, {
    proxy: "http://localhost:3000",
        browser: "/usr/bin/google-chrome-stable",
        port: 7000,
  }, cb);
}

function startNodemon(cb) {
  let server = nodemon({
    script: './server/index.js',
    watch: ['server'],
    ext: 'js pug',
    stdout: false,
    done: cb
  });
 
  server.on('stdout', (stdout) => {
    process.stdout.write(stdout);

    if(stdout === '[info:connection.js] connection OK') {
      browserSync.reload();
    }
  });
  cb();
}

function watchAndReload(cb) {
  let server = nodemon({
    script: './server/index.js',
    watch: ['server'],
    ext: 'js pug',
    stdout: false,
  });

  server.on('stdout', (stdout) => {
    process.stdout.write(stdout);

    if(stdout.includes("connection OK")) {
      browserSync.reload();
    }
  });

  server.on('stderr', stderr => process.stderr.write(stderr));


  browserSync.init(null, {
    proxy: "http://localhost:3000",
        browser: "/usr/bin/google-chrome-stable",
        port: 7000,
  });

  cb();
}



exports.styles = styles;
exports.scripts = scripts;
exports.clean = clean;
exports.nodemon = startNodemon;
exports.dev = series(clean, styles, scripts,
  parallel(watchStyles, watchScripts, watchAndReload));





