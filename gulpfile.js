var gulp = require('gulp'),
	connect = require('gulp-connect');

gulp.task('html', function() {
	return gulp.src('./app/*.html')
		.pipe(gulp.dest('./dist'))
		.pipe(connect.reload());
});

gulp.task('js', function() {
	gulp.src('./app/main.js')
		.pipe(gulp.dest('./dist'))
		.pipe(connect.reload());

	gulp.src('./app/objects.js')
		.pipe(gulp.dest('./dist'))
		.pipe(connect.reload());
});

gulp.task('connect', function() {
	connect.server({
		root: 'dist',
		livereload: true,
		port: 3000
	});
});

gulp.task('watch', function() {
	gulp.watch('./app/**/*.html', ['html']);
	gulp.watch('./app/**/*.js', ['js']);
});

gulp.task('default', ['html', 'js', 'watch', 'connect']);