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
    js: {
        input: [
            'node_modules/jquery/dist/jquery.min.js',
            'src/js/**/*.js'
        ],
        output: 'dist/js/'
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
const {gulp, src, dest, watch, series, parallel} = require('gulp');
const del = require('del');
const flatmap = require('gulp-flatmap');
const lazypipe = require('lazypipe');
const rename = require('gulp-rename');

// Javascript
const babel = require("gulp-babel");
const concat = require("gulp-concat");
const sourcemaps = require("gulp-sourcemaps");
const babelify = require("babelify");

// Styles
const sass = require('gulp-sass');
const minify = require('gulp-cssnano');

// SVGs
const svgmin = require('gulp-svgmin');

// BrowserSync
const browserSync = require('browser-sync');

const cleanDist = function (done) {
    del.sync([
        paths.output
    ]);
    return done();
};

const buildStyles = function (done) {
    return src(paths.styles.input)
        .pipe(sass({
            outputStyle: 'expanded',
            sourceComments: true,
            includePaths: ['./node_modules/compass-mixins/lib'],
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
const buildSVGs = function (done) {
    return src(paths.svgs.input)
        .pipe(svgmin())
        .pipe(dest(paths.svgs.output));
};

const copyFiles = function (done) {
    return src(paths.staticFiles.input)
        .pipe(dest(paths.staticFiles.output));

};

const copyFonts = function (done) {
    return src(paths.fonts.input)
        .pipe(dest(paths.fonts.output));

};

const buildJavascript = function(done) {
    return src(paths.js.input)
        .pipe(sourcemaps.init())
        .pipe(babel({presets: ['@babel/env']}))

        .pipe(concat("index.js"))
        .pipe(sourcemaps.write("."))
        .pipe(dest(paths.js.output))
};

const startServer = function (done) {
    browserSync.init({
        server: {
            baseDir: "./dist",
            index: "home.html"
        }
    });
    done();
};

const reloadBrowser = function (done) {
    browserSync.reload();
    done();
};

const watchSource = function (done) {
    watch(paths.input, series(exports.default, reloadBrowser));
    done();
};

exports.default = series(
    cleanDist,
    parallel(
        buildStyles,
        buildSVGs,
        copyFonts,
        buildJavascript,
        copyFiles
    )
);

exports.watch = series(
    exports.default,
    startServer,
    watchSource
);



