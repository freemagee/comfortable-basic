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
const changed = require("gulp-changed");
const cssnano = require("cssnano");
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
const displayError = error => {
  // Initial building up of the error
  let errorString = `[${error.plugin}]`;

  errorString += ` ${error.message.replace("\n", " ")}`; // Removes new line at the end

  // If the error contains the filename or line number add it to the string
  if (error.fileName) {
    errorString += ` in ${error.fileName}`;
  }

  if (error.lineNumber) {
    errorString += ` on line ${error.lineNumber}`;
  }

  // This will output an error like the following:
  // [gulp-sass] error message in file_name on line 1
  notify(errorString).write("");
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
      .pipe(
        plumber(error => {
          // If there is an error use the custom displayError function
          displayError(error);
          gulp.emit("end");
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
