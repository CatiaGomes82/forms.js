const gulp = require('gulp'),
    terser = require('gulp-terser'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync').create();

gulp.task('minify-script', function () {
    return gulp.src('src/*.js')
        .pipe(rename(function (dir, base, ext) {
            return base + ".min" + ext;
        }))
        .pipe(terser())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('watch', function (callback) {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    }, callback);

    return gulp.watch(['src/*.js', 'index.html']).on('change', browserSync.reload);
});

gulp.task('default', gulp.parallel('minify-script', 'watch'));