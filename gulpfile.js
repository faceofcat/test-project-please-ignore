const gulp = require("gulp");
const ts = require("gulp-typescript");
const merge = require('merge2');
const zip = require('gulp-zip');
const sourcemaps = require('gulp-sourcemaps');
const minify = require('gulp-minify');
const distPath = "dist";

gulp.task("build", () => {
    var project = ts.createProject("./src/tsconfig.json");
    var tsResult = project.src()
        .pipe(sourcemaps.init())
        .pipe(project());

    return merge(
        tsResult.dts.pipe(gulp.dest(distPath)),
        tsResult
            .js
            .pipe(sourcemaps.mapSources(function(sourcePath, file) {
                return "../src/" + sourcePath;
            }))
            .pipe(sourcemaps.write("."))
            .pipe(gulp.dest(distPath))
    );
});

gulp.task("minify", ["build"], () => {
  return gulp.src(distPath + "/**/*.js")
    .pipe(minify({
        ext: {
            src:"-debug.js",
            min:"-min.js"
        },
        ignoreFiles: ["**/*-debug.js", "**/*-min.js"]
    }))
    .pipe(gulp.dest(distPath));
});

gulp.task("default", ["build", "minify"], () => {
    const distFiles = [distPath + "/**/*-debug.js", distPath + "/**/*-min.js", distPath + "/**/*.js.map", "!/**/*.zip"];
    const sourceFiles = ["src/**/*", "!/**/tsconfig.json"];

    return merge(
        gulp.src(distFiles).pipe(zip('test-dist.zip')).pipe(gulp.dest(distPath)),
        gulp.src(sourceFiles).pipe(zip('test-source.zip')).pipe(gulp.dest(distPath))
    );
});