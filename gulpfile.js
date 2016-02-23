require('es6-promise').polyfill()

var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    jshint      = require('gulp-jshint'),
    concat      = require('gulp-concat'),
    imagemin    = require('gulp-imagemin'),
    plumber     = require('gulp-plumber'),
    notify      = require('gulp-notify'),
    livereload  = require('gulp-livereload'),
    fs          = require('node-fs'),
    fse         = require('fs-extra'),
    json        = require('json-file');
 

var themeName = json.read('./package.json').get('themeName');
var themeDir = '../' + themeName;

var config = {
    sourceDir: './src',
    destDir: './theme-boilerplate',
};

var plumberErrorHandler = { errorHandler: notify.onError({
    title: 'Gulp',
    message: 'Error: <%= error.message %>'
  })
};

gulp.task('sass',function(){
  gulp.src(config.sourceDir+'/css/*.scss')
    .pipe(plumber(plumberErrorHandler))
    .pipe(sass())
    .pipe(gulp.dest(config.destDir+'/css'))
    .pipe(livereload());
});

gulp.task('js',function(){
  gulp.src(config.sourceDir+'/js/*.scss')
    .pipe(jshint())
    .pipe(jshint.reporter('fail'))
    .pipe(concat('theme.js'))
    .pipe(gulp.dest(config.destDir+'/js'))
})

gulp.task('img',function(){
  gulp.src(config.destDir+'img/src/*.{png,jpg,gif}')
    .pipe(imagemin({
      optimizationLevel:7,
      progressive: true
    }))
})

gulp.task('init', function() {
  fs.mkdirSync(themeDir, 765, true);
  fse.copySync('theme-boilerplate', themeDir + '/');
 
});

gulp.task('watch',function(){
  livereload.listen();
  gulp.watch(config.sourceDir+'/css/*.scss',['sass']);
  gulp.watch(config.sourceDir+'/js/*.js',['js']);
  gulp.watch('img/src/*.{png,jpg,gif}',['img']);
})

gulp.task('default',['sass','js','img','watch'])

