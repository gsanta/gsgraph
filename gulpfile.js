var gulp = require('gulp');
var ts = require('gulp-typescript');
var jasmine = require('gulp-jasmine');
var JasmineSpecReporter = require('jasmine-spec-reporter')

gulp.task('ts-build', function () {
	return gulp.src('core/**/*.ts')
		.pipe(ts())
		.pipe(gulp.dest('build/core'));
});

gulp.task('unit-test', ['ts-build'], function () {
        return gulp.src('build/**/*Spec.js')
            .pipe(jasmine({
                reporter: new JasmineSpecReporter({
                     displayStacktrace: 'all'
                 })
            }));
    });

gulp.task('default', ['ts-build']);
