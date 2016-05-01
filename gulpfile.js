var gulp = require('gulp');
var ts = require('gulp-typescript');

gulp.task('default', function () {
	return gulp.src('core/**/*.ts')
		.pipe(ts())
		.pipe(gulp.dest('build/core'));
});
