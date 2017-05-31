const gulp = require("gulp");
const del = require("del");
const ts = require("gulp-typescript");
const runSequence = require("run-sequence");
const sourcemaps = require('gulp-sourcemaps');
const webpack = require('webpack-stream');

const config = {
    output: "dist/resources/app",
    electron: {
        src: "node_modules/electron/dist/**/*",
        dest: "dist"
    },
    webpack: {
        entry: "app/ImageViewer.tsx",
        config: "./webpack.config.js"
    },
    tsConfig: "tsconfig.json",
    tsSource: [
        "app/**/*.ts",
        "app/**/*.tsx"
    ],
    resources: [
        "app/**/*",
        "!app/**/*.ts",
        "!app/**/*.tsx",
    ]
};

gulp.task("clean", function(callback) {
    return del(config.electron.dest);
});

gulp.task("electron-copy", function() {
    return gulp.src(config.electron.src)
        .pipe(gulp.dest(config.electron.dest));
});

gulp.task("ts-compile", function() {
    const tsProject = ts.createProject(config.tsConfig);
    let hasErrors = false;
    const tsResult = gulp.src(config.tsSource)
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .on('error', function () { hasErrors = true; })
        .on('finish', function () { hasErrors && process.exit(1); });
    return tsResult.js
        .pipe(sourcemaps.write('.', {
            sourceRoot: function(file) { return file.cwd + '/app'; }
        }))
        .pipe(gulp.dest(config.output));
});

gulp.task("resources-copy", function() { 
    return gulp.src(config.resources)
        .pipe(gulp.dest(config.output));
});

gulp.task('bundle', function() {
    return gulp.src(config.webpack.entry)
        .pipe(webpack( require(config.webpack.config) ))
        .pipe(gulp.dest(config.output));
});

gulp.task("build", function(callback) {
    runSequence(
        "clean",
        "electron-copy",
        //"bundle",
        "ts-compile",
        "resources-copy",
        callback
    );
});