require('es6-promise').polyfill()

var gulp          = require('gulp'),
    postcss       = require('gulp-postcss'),
    sass          = require('gulp-sass'),
    csswring      = require('csswring'),
    autoprefixer  = require('autoprefixer'),
    jshint        = require('gulp-jshint'),
    concat        = require('gulp-concat'),
    uglify        = require('gulp-uglify'),
    imagemin      = require('gulp-imagemin'),
    plumber       = require('gulp-plumber'),
    notify        = require('gulp-notify'),
    livereload    = require('gulp-livereload'),
    fs            = require('node-fs'),
    fse           = require('fs-extra'),
    json          = require('json-file');
 

var themeName = json.read('./package.json').get('themeName');
var themeDir = '../' + themeName;

var config = {
  bootstrapDir: './bower_components/bootstrap-sass',
  jqueryDir: './bower_components/jquery',
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
  return gulp.src([
    // config.jqueryDir+'/dist/jquery.min.js',
    config.bootstrapDir+'/assets/javascripts/bootstrap.min.js',
    config.sourceDir+'/js/**/**.js',
    '!'+config.sourceDir+'/js/dist/main.js'
    ])
    .pipe(concat('main.js'))
    .pipe(gulp.dest(config.sourceDir+'/js/dist'))
    .pipe(livereload());
})

gulp.task('minjs', function(){
  return gulp.src(config.sourceDir+'/js/dist/main.js')
  .pipe(uglify())
  .pipe(gulp.dest(config.destDir+'/js'))
  .pipe(livereload());
})

gulp.task('img',function(){
  gulp.src(config.destDir+'img/src/*.{png,jpg,gif}')
    .pipe(imagemin({
      optimizationLevel:7,
      progressive: true
    }))
})

gulp.task('template',function(){
  gulp.src(config.destDir+'/**')
  .pipe(livereload());
})

gulp.task('production', function() {
  fs.mkdirSync(themeDir, 765, true);
  fse.copySync('theme-boilerplate', themeDir + '/');
 
});

gulp.task('watch',function(){
  livereload.listen();
  gulp.watch(config.sourceDir+'/css/*.scss',['sass']);
  gulp.watch([config.sourceDir+'/js/**/**.js','!'+config.sourceDir+'/js/dist'],['js']);
  gulp.watch(config.sourceDir+'/js/dist/main.js',['minjs']);
  gulp.watch('img/src/*.{png,jpg,gif}',['img']);
  gulp.watch(config.destDir+'/**',['template']);
})

gulp.task('default',['sass','js','img','template','watch'])

