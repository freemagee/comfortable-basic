/* eslint no-console: 0 */
import gulp from "gulp";
// Define Sass, Autoprefixer & Sourcemaps
import sass from "gulp-sass";
import sourcemaps from "gulp-sourcemaps";
// POST CSS
import postcss from "gulp-postcss";
import fontMagician from "postcss-font-magician";
import postcssPresetEnv from "postcss-preset-env";
import cssnano from "cssnano";
// Define other utilities
import notify from "gulp-notify";
import plumber from "gulp-plumber";
import colors from "ansi-colors";
import beeper from "beeper";
import browserSync from "browser-sync";
import del from "del";
import hash from "gulp-hash";

// Browsersync init
browserSync.create();
// Common paths
const basePaths = {
  src: "./src/",
  dest: "./static/"
};
const paths = {
  styles: {
    src: `${basePaths.src}scss`,
    files: `${basePaths.src}scss/**/*.scss`,
    dest: `${basePaths.dest}css`,
    data: `${basePaths.dest}data`
  }
};
// Error handler
// Heavily inspired by: https://github.com/mikaelbr/gulp-notify/issues/81#issuecomment-100422179
const reportError = function reportErrorFn(error) {
  const messageOriginal = error.messageOriginal ? error.messageOriginal : "";

  notify({
    title: `Task Failed [${error.plugin}]`,
    message: messageOriginal,
    sound: "Sosumi" // See: https://github.com/mikaelbr/node-notifier#all-notification-options-with-their-defaults
  }).write(error);

  beeper(); // Beep 'sosumi' again

  // Inspect the error object
  // console.log(error);

  // Easy error reporting
  // console.log(error.toString());

  // Pretty error reporting
  let report = "";
  const chalk = colors.white.bgRed;

  report += `${chalk("TASK:")} [${error.plugin}]\n`;

  if (error.file) {
    report += `${chalk("FILE:")} ${error.file}\n`;
  }

  if (error.line) {
    report += `${chalk("LINE:")} ${error.line}\n`;
  }

  report += `${chalk("PROB:")} ${error.message}\n`;

  console.error(report);

  // Prevent the 'watch' task from stopping
  this.emit("end");
};
// A change event function, displays which file changed
const changeEvent = (path, type) => {
  const filename = path.split("\\").pop();
  notify(`[watcher] File ${filename} was ${type}, compiling...`).write("");
};

// SASS
// =============================================================================
function styles() {
  const fontMagicianConfig = {
    variants: {
      Montserrat: {
        "400": ["woff", "woff2"],
        "400 italic": ["woff", "woff2"],
        "600": ["woff", "woff2"],
        "700": ["woff", "woff2"]
      },
      "Ubuntu Mono": {
        "400": ["woff", "woff2"],
        "400 italic": ["woff", "woff2"],
        "700": ["woff", "woff2"]
      }
    },
    foundries: "google",
    protocol: "https:"
  };
  const processors = [
    fontMagician(fontMagicianConfig),
    postcssPresetEnv(),
    cssnano()
  ];

  // Delete our old css files
  del([`${basePaths.dest}css/**/*`]);

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
      // Hashing for cache busting, hash before generating source map
      .pipe(hash())
      // Write out the source map to the same dir
      .pipe(sourcemaps.write("."))
      // Finally output a css file
      .pipe(gulp.dest(paths.styles.dest))
      // Create a hash map
      .pipe(hash.manifest("hash.json"))
      // Put the map in the data directory
      .pipe(gulp.dest("./data/css"))
      // Inject into browser
      .pipe(
        browserSync.stream({
          match: "**/*.css"
        })
      )
  );
}
const processStyles = gulp.series(styles);
processStyles.description = "Convert SCSS to CSS";
gulp.task("processStyles", processStyles);

// WATCH
// =============================================================================
function watchFiles() {
  gulp
    .watch(
      paths.styles.files,
      {
        delay: 300
      },
      gulp.series("processStyles")
    )
    .on("change", evt => {
      changeEvent(evt, "changed");
    });
}
const watch = gulp.series(watchFiles);
watch.description = "Keep an eye on asset changes";
gulp.task("watch", watch);

// SERVE
// =============================================================================
const startServer = () => {
  browserSync.init({
    proxy: "http://localhost:1313/"
  });
};
const serve = gulp.series(startServer);
serve.description = "Start a browser sync session mapped to the localhost port";
gulp.task("serve", serve);

// DEVELOP
// =============================================================================
gulp.task("develop", gulp.parallel(serve, watch));

// DEFAULT - does nothing!
// =============================================================================
gulp.task(
  "default",
  () =>
    new Promise(resolve => {
      const chalk = colors.white.bgBlue;
      const message = `${chalk("Action:")} for task information type gulp -T`;

      console.log(message);
      resolve();
    })
);
