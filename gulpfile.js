/**
 * Settings
 * Turn on/off build features
 */

const paths = {
    input: 'src/',
    output: 'dist/',
    styles: {
        input: 'src/sass/**/*.{scss,sass}',
        output: 'dist/css/'
    },
    fonts: {
        input: 'src/fonts/**/*.{eot,svg,ttf,wott}',
        output: 'dist/fonts/'
    },
    svgs: {
        input: 'src/svg/*.svg',
        output: 'dist/svg/'
    },
    staticFiles: {
        input: 'src/static/**/*',
        output: 'dist/'
    },
    reload: './dist/'
};


/**
 * Gulp Packages
 */

// General
var {gulp, src, dest, watch, series, parallel} = require('gulp');
var del = require('del');
var flatmap = require('gulp-flatmap');
var lazypipe = require('lazypipe');
var rename = require('gulp-rename');

// Styles
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var minify = require('gulp-cssnano');

// SVGs
var svgmin = require('gulp-svgmin');

// BrowserSync
var browserSync = require('browser-sync');

var cleanDist = function (done) {
    del.sync([
        paths.output
    ]);
    return done();
};

var buildStyles = function (done) {
    return src(paths.styles.input)
        .pipe(sass({
            outputStyle: 'expanded',
            sourceComments: true,
            includePaths: ['./node_modules/compass-mixins/lib'],
        }))
        .pipe(prefix({
            browsers: ['last 2 version', '> 0.25%'],
            cascade: true,
            remove: true
        }))
        .pipe(dest(paths.styles.output))
        .pipe(rename({suffix: '.min'}))
        .pipe(minify({
            discardComments: {
                removeAll: true
            }
        }))
        .pipe(dest(paths.styles.output));

};

// Optimize SVG files
var buildSVGs = function (done) {
    return src(paths.svgs.input)
        .pipe(svgmin())
        .pipe(dest(paths.svgs.output));
};

var copyFiles = function (done) {
    return src(paths.staticFiles.input)
        .pipe(dest(paths.staticFiles.output));

};

var copyFonts = function (done) {
    return src(paths.fonts.input)
        .pipe(dest(paths.fonts.output));

};

var startServer = function (done) {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
    done();
};

var reloadBrowser = function (done) {
    browserSync.reload();
    done();
};

var watchSource = function (done) {
    watch(paths.input, series(exports.default, reloadBrowser));
    done();
};

exports.default = series(
    cleanDist,
    parallel(
        buildStyles,
        buildSVGs,
        copyFonts,
        copyFiles
    )
);

exports.watch = series(
    exports.default,
    startServer,
    watchSource
);
