var gulp = require("gulp");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");

var files = [
  "js/components/module.js",
  "js/components/.init.js",
  "js/components/listeners.js",
  "js/components/ajax.js",
  "js/components/ajax.js",
  "js/components/local.js",
  "js/components/config.js",
  "js/components/controller.js",
  "js/components/DOM.js",
  "js/components/hash.js",
  "js/components/init.js",
  "js/components/load.js",
  "js/components/mutation.js",
  "js/components/repeater.js",
  "js/components/routes.js",
  "js/components/scope.js",
  "js/components/scope.save.js",
  "js/components/scope.repeat.js",
  "js/components/scope.toolkit.js",
  "js/components/transition.js",
  "js/components/util.js",
  "js/components/view.js",
  "js/build/RouteConfig.js"
];

gulp.task("concat", function () {
  var top = gulp.src("./js/build/top.js"),
      bottom = gulp.src("./js/build/bottom.js");

  return gulp
    .src(files)
    .pipe(concat("routing.js"))
    .pipe(gulp.dest("./dist/"));
});

gulp.task("minify", function () {
  return gulp
    .src("./dist/routing.js")
    .pipe(uglify())
    .pipe(gulp.dest("./dist/min"));
});
