/**
 * npm install gulp gulp-if gulp-rename gulp-debug gulp-sass node-sass-tilde-importer gulp-autoprefixer gulp-babel @babel/core @babel/preset-env gulp-babel-minify --save-dev
 */

const { src, dest, task, series, watch } = require('gulp');
const gulpif = require('gulp-if');
const rename = require('gulp-rename');
const debug = require('gulp-debug');
const sass = require('gulp-sass');
const tildeImporter = require('node-sass-tilde-importer');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const babelMinify = require("gulp-babel-minify");



// ===============================
// # SETTINGS
// ===============================

const DEVELOPMENT = (process.env.NODE_ENV || 'production') === 'development';
const PATH_BASE = '.';
const PATHS = {
    styles: {
        watch: `${PATH_BASE}/assets/scss/**/*.{scss,css}`,
        dest: `${PATH_BASE}/css`,
    },
    styles2: {
        watch: `${PATH_BASE}/assets/scss2/**/*.{scss,css}`,
        dest: `${PATH_BASE}/css2`,
    },
    styles4: {
        watch: `${PATH_BASE}/assets/scss4/**/*.{scss,css}`,
        dest: `${PATH_BASE}/css4`,
    },
    scripts: {
        watch: `${PATH_BASE}/assets/js/**/*.js`,
        dest: `${PATH_BASE}/js`,
    },
};





// ===============================
// # FUNCTIONS
// ===============================

const stylesCompile = () => {
    return src(PATHS.styles.watch, { sourcemaps: DEVELOPMENT })
        .pipe(rename({suffix: '.min'}))
        .pipe(sass({outputStyle: DEVELOPMENT ? 'expanded' : 'compressed', importer: tildeImporter}).on('error', sass.logError))
        .pipe(autoprefixer({browsers: ['> 5%', 'Safari >= 8', 'Explorer >= 10']}))
        .pipe(dest(PATHS.styles.dest, { sourcemaps: DEVELOPMENT }))
        .pipe(debug({title: 'SCSS - compile:', showCount: false}));
}

const stylesCompile2 = () => {
    return src(PATHS.styles2.watch, { sourcemaps: DEVELOPMENT })
        .pipe(rename({suffix: '.min'}))
        .pipe(sass({outputStyle: DEVELOPMENT ? 'expanded' : 'compressed', importer: tildeImporter}).on('error', sass.logError))
        .pipe(autoprefixer({browsers: ['> 5%', 'Safari >= 8', 'Explorer >= 10']}))
        .pipe(dest(PATHS.styles2.dest, { sourcemaps: DEVELOPMENT }))
        .pipe(debug({title: 'SCSS - compile:', showCount: false}));
}

const stylesCompile4 = () => {
    return src(PATHS.styles4.watch, { sourcemaps: DEVELOPMENT })
        .pipe(rename({suffix: '.min'}))
        .pipe(sass({outputStyle: DEVELOPMENT ? 'expanded' : 'compressed', importer: tildeImporter}).on('error', sass.logError))
        .pipe(autoprefixer({browsers: ['> 5%', 'Safari >= 8', 'Explorer >= 10']}))
        .pipe(dest(PATHS.styles4.dest, { sourcemaps: DEVELOPMENT }))
        .pipe(debug({title: 'SCSS - compile:', showCount: false}));
}

const stylesWatch = () => {
    return watch(PATHS.styles.watch, stylesCompile);
}

const stylesWatch2 = () => {
    return watch(PATHS.styles2.watch, stylesCompile2);
}

const stylesWatch4 = () => {
    return watch(PATHS.styles4.watch, stylesCompile4);
}

const scriptsCompile = () => {
    return src(PATHS.scripts.watch, { sourcemaps: DEVELOPMENT })
        .pipe(rename({suffix: '.min'}))
        .pipe(babel({presets: ['@babel/env']}))
        .pipe(gulpif(!DEVELOPMENT, babelMinify({mangle: {keepClassName: true}})))
        .pipe(dest(PATHS.scripts.dest, { sourcemaps: DEVELOPMENT }))
        .pipe(debug({title: 'JS - compile:', showCount: false}));
}

const scriptsWatch = () => {
    return watch(PATHS.scripts.watch, scriptsCompile);
}



// ===============================
// # TASKS
// ===============================

task('styles:compile', stylesCompile);
task('styles:watch', stylesWatch);
task('styles:watch2', stylesWatch2);
task('styles:watch4', stylesWatch4);
task('scripts:compile', scriptsCompile);
task('scripts:watch', scriptsWatch);

task('default', series(stylesCompile, scriptsCompile));
/**/;module.exports = gulp;