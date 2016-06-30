var gulp = require("gulp");
var concat = require("gulp-concat");

var files = [
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
];

gulp.task("scripts", function () {
  return gulp
    .src(files)
    .pipe(concat("routing.js"))
    .pipe(gulp.dest("./dist/"));
});
