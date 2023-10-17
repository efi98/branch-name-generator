const gulp = require("gulp");
const ts = require("gulp-typescript");
const sass = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const cleanCSS = require("gulp-clean-css");
const browserSync = require("browser-sync").create();
const cleanhtml = require("gulp-cleanhtml");
const server = require("gulp-webserver");
const uglify = require("gulp-uglify-es").default;

const tsProject = ts.createProject("tsconfig.json");

// Compile TypeScript files
gulp.task("compile-ts", () => {
  return tsProject
    .src()
    .pipe(tsProject())
    .js.pipe(uglify())
    .pipe(gulp.dest("dist"));
});

// Process Sass and CSS
gulp.task("compile-sass", () => {
  return gulp
    .src("src/styles/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(concat("styles.css"))
    .pipe(cleanCSS())
    .pipe(gulp.dest("dist"));
});

// Copy HTML and assets
gulp.task("copy-html", () => {
  return gulp.src("src/index.html").pipe(cleanhtml()).pipe(gulp.dest("dist"));
});

gulp.task("copy-assets", () => {
  return gulp.src("src/assets/**/*.*").pipe(gulp.dest("dist/assets"));
});

// Watch for changes and reload the browser
gulp.task("watch", () => {
  gulp.src("dist", { allowEmpty: true }).pipe(
    server({
      host: "localhost",
      path: "/",
      livereload: true,
      open: true,
      port: 3000, // set a port to avoid conflicts with other local apps
    })
  );

  gulp.watch("src/**/*.ts", gulp.series("compile-ts"));
  gulp.watch("src/**/*.scss", gulp.series("compile-sass"));
  gulp.watch("src/index.html", gulp.series("copy-html"));
  gulp.watch("src/assets/**/*.*", gulp.series("copy-assets"));
  gulp.watch("dist/**/*.*").on("change", browserSync.reload);
});

// Default task
gulp.task(
  "default",
  gulp.series(
    gulp.parallel("compile-ts", "compile-sass", "copy-html", "copy-assets"),
    "watch"
  )
);

// Prod task
gulp.task(
  "prod",
  gulp.parallel("compile-ts", "compile-sass", "copy-html", "copy-assets")
);
