const gulp = require("gulp");
// Define Sass, Autoprefixer & Sourcemaps
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
// POST CSS
const postcss = require("gulp-postcss");
const cssnext = require("postcss-cssnext");
// Define other utilities
const notify = require("gulp-notify");
const plumber = require("gulp-plumber");
const cssnano = require("cssnano");
const colors = require("ansi-colors");
const beeper = require("beeper");
const browserSync = require("browser-sync").create();

const basePaths = {
  src: "./src/",
  dest: "./static/"
};
const paths = {
  styles: {
    src: `${basePaths.src}scss`,
    files: `${basePaths.src}scss/**/*.scss`,
    dest: `${basePaths.dest}css`
  }
};
// Error handler
// Heavily inspired by: https://github.com/mikaelbr/gulp-notify/issues/81#issuecomment-100422179
const reportError = function(error) {
  console.log(error);

  const messageOriginal = error.messageOriginal
    ? error.messageOriginal
    : "";

  notify({
    title: "Task Failed [" + error.plugin + "]",
    message: messageOriginal,
    sound: "Sosumi" // See: https://github.com/mikaelbr/node-notifier#all-notification-options-with-their-defaults
  }).write(error);

  beeper(); // Beep 'sosumi' again

  // Inspect the error object
  //console.log(error);

  // Easy error reporting
  //console.log(error.toString());

  // Pretty error reporting
  let report = "";
  let chalk = colors.white.bgRed;

  report += chalk("TASK:") + " [" + error.plugin + "]\n";

  if (error.file) {
    report += chalk("FILE:") + " " + error.file + "\n";
  }

  if (error.line) {
    report += chalk("LINE:") + " " + error.line + "\n";
  }

  report += chalk("PROB:") + " " + error.message + "\n";

  console.error(report);

  // Prevent the 'watch' task from stopping
  this.emit("end");
};
// A change event function, displays which file changed
const changeEvent = evt => {
  const filename = evt.path.split("\\").pop();
  notify(`[watcher] File ${filename} was ${evt.type}, compiling...`).write("");
};

// SASS
// =============================================================================
gulp.task("css", () => {
  const nanoOptions = {
    zindex: false
  };
  const processors = [cssnext(), cssnano(nanoOptions)];

  // Taking the path from the paths object
  return (
    gulp
      .src(paths.styles.files)
      // Deal with errors, but prevent Gulp from stopping
      .pipe(
        plumber({
          errorHandler: reportError
        })
      )
      .pipe(sourcemaps.init())
      // Sass
      .pipe(sass())
      // Process with PostCSS - autoprefix & minify
      .pipe(postcss(processors))
      .pipe(sourcemaps.write("."))
      // Finally output a css file
      .pipe(gulp.dest(paths.styles.dest))
      // Inject into browser
      .pipe(
        browserSync.stream({
          match: "**/*.css"
        })
      )
  );
});

// WATCH
// =============================================================================
gulp.task("watch", ["css"], () =>
  // Watch the files in the paths object, and when there is a change, fun the functions in the array

  gulp
    .watch(paths.styles.files, ["css"])
    // Also when there is a change, display what file was changed, only showing the path after the 'sass folder'
    .on("change", evt => {
      changeEvent(evt);
    })
);

// SERVE
// =============================================================================
gulp.task("serve", ["watch"], () => {
  browserSync.init({
    proxy: "http://localhost:1313/"
  });
});
