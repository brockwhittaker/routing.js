var gulp = require("gulp");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");

var files = [
  "lib/build/top.js",
  "lib/components/.init.js",
  "lib/components/ajax.js",
  "lib/components/config.js",
  "lib/components/controller.js",
  "lib/components/DOM.js",
  "lib/components/hash.js",
  "lib/components/init.js",
  "lib/components/load.js",
  "lib/components/mutation.js",
  "lib/components/routes.js",
  "lib/components/transition.js",
  "lib/components/util.js",
  "lib/components/view.js",
  "lib/build/bottom.js"
];

gulp.task("concat", function () {
  var top = gulp.src("./lib/build/top.js"),
      bottom = gulp.src("./lib/build/bottom.js");

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
