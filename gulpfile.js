require('es6-promise').polyfill()

var gulp          = require('gulp'),
    postcss       = require('gulp-postcss'),
    sass          = require('gulp-sass'),
    csswring      = require('csswring');
    autoprefixer  = require('autoprefixer'),
    imagemin      = require('gulp-imagemin'),
    plumber       = require('gulp-plumber'),
    jshint        = require('gulp-jshint'),
    concat        = require('gulp-concat'),
    uglify        = require('gulp-uglify'),
    notify        = require('gulp-notify'),
    livereload    = require('gulp-livereload'),
    fs            = require('node-fs'),
    fse           = require('fs-extra'),
    json          = require('json-file');
 

var themeName = json.read('./package.json').get('themeName');
var themeDir = '../' + themeName;

var config = {
  bootstrapDir: './bower_components/bootstrap-sass',
  sourceDir: './src',
  destDir: './theme-boilerplate',
};

var plumberErrorHandler = { errorHandler: notify.onError({
    title: 'Gulp',
    message: 'Error: <%= error.message %>'
  })
};

gulp.task('sass',function(){
  // postcss processors
  var processors = [
    csswring,
    autoprefixer({browsers:['last 2 version']})
  ];

  gulp.src(config.sourceDir+'/css/*.scss')
    .pipe(plumber(plumberErrorHandler))
    .pipe(sass({
      includePaths: [config.bootstrapDir + '/assets/stylesheets'],
    }))
    .pipe(postcss(processors))
    .pipe(gulp.dest(config.destDir+'/css'))
    .pipe(livereload());
});

gulp.task('js',function(){
  gulp.src(config.sourceDir+'/js/*.js')
    .pipe(plumber(plumberErrorHandler))
    .pipe(jshint())
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(jshint.reporter('fail'))
    .pipe(gulp.dest(config.destDir+'/js'))
})

gulp.task('img',function(){
  gulp.src(config.destDir+'img/src/*.{png,jpg,gif}')
    .pipe(imagemin({
      optimizationLevel:7,
      progressive: true
    }))
})

gulp.task('production', function() {
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

