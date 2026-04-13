require("dotenv").config();

var gulp = require("gulp"),
  concat = require("gulp-concat"),
  uglify = require("gulp-uglify"),
  babel = require("gulp-babel"),
  minifyCSS = require("gulp-minify-css"),
  sass = require("gulp-sass")(require("sass")),
  htmlmin = require("gulp-htmlmin"),
  clean = require("gulp-clean"),
  autoprefixer = require("gulp-autoprefixer"),
  image = require("gulp-image"),
  webp = require("gulp-webp"),
  svgSprite = require("gulp-svg-sprites"),
  svgmin = require("gulp-svgmin"),
  cheerio = require("gulp-cheerio"),
  replace = require("gulp-replace"),
  connect = require("gulp-connect"),
  hash = require("gulp-hash-filename"),
  rename = require("gulp-rename"),
  htmlreplace = require("gulp-html-replace"),
  ftp = require("vinyl-ftp"),
  fancy = require("fancy-log"),
  fs = require("fs"),
  open = require("gulp-open");

const DIST = "./dist";

var hashedJS;
var hashedCSS;

gulp.task("clean-css", function () {
  return gulp
    .src(`${DIST}/css/*`, { read: false, allowEmpty: true })
    .pipe(clean());
});

gulp.task("clean-js", function () {
  return gulp
    .src(`${DIST}/js/*`, { read: false, allowEmpty: true })
    .pipe(clean());
});

//
// SVG SPRITE
//
gulp.task("svg-sprite", function () {
  return (
    gulp
      .src("./src/img/svg/*.svg")
      .pipe(
        cheerio({
          run: function ($) {},
          parserOptions: { xmlMode: true },
        }),
      )
      // cheerio plugin create unnecessary string '>', so replace it.
      .pipe(replace("&gt;", ">"))
      // build svg sprite
      .pipe(
        svgSprite({
          mode: "symbols",
          preview: false,
          selector: "icon-%f",
          svg: {
            symbols: "symbol_sprite.html",
          },
        }),
      )
      .pipe(
        svgmin({
          plugins: [
            {
              removeComments: true,
            },
            {
              removeMetadata: true,
            },
            {
              removeEditorsNSData: true,
            },
            {
              removeAttrs: { attrs: "data.*" },
            },
            {
              removeStyleElement: true,
            },
            {
              removeDesc: true,
            },
            {
              cleanupIDs: false,
            },
          ],
        }),
      )
      .pipe(gulp.dest(`${DIST}/img`))
  );
});

//
// IMAGES
//
gulp.task("image-to-webp", () =>
  gulp
    .src("./src/img/**/*.{ico,jpg,jpeg,png}")
    .pipe(webp())
    .pipe(gulp.dest(`${DIST}/img`)),
);

gulp.task("image-min", () =>
  gulp
    .src("./src/img/**/*.{ico,jpg,jpeg,png,webp,svg}")
    .pipe(image())
    .pipe(gulp.dest(`${DIST}/img`))
    .pipe(connect.reload()),
);

//
// SASS → CSS
//
gulp.task("styles", function () {
  return gulp
    .src([
      "node_modules/bootstrap/scss/bootstrap-reboot.scss",
      "node_modules/bootstrap/scss/bootstrap-grid.scss",
      "node_modules/slick-carousel/slick/slick.css",
      "node_modules/slick-carousel/slick/slick-theme.css",
      "node_modules/swiper/swiper-bundle.min.css",
      "./src/scss/*.scss",
    ])
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(concat("style.css"))
    .pipe(minifyCSS())
    .pipe(hash({ format: "{name}-{hash:8}{ext}" }))
    .pipe(
      rename(function (path) {
        path.basename += ".min";
        hashedCSS = "css/" + path.basename + ".css";
      }),
    )
    .pipe(gulp.dest(`${DIST}/css`))
    .pipe(connect.reload());
});

//
// JS
//
const js = ["./src/js/common.js"];

gulp.task("minify-main-js", function () {
  return gulp
    .src("./src/js/common.js")
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
      }),
    )
    .pipe(uglify())
    .pipe(
      hash({
        format: "{name}-{hash:8}{ext}",
      }),
    )
    .pipe(
      rename(function (path) {
        path.basename += ".min";
        hashedJS = "./js/" + path.basename + ".js";
      }),
    )
    .pipe(gulp.dest(`${DIST}/js`))
    .pipe(connect.reload());
});

gulp.task("scripts", function () {
  return gulp
    .src([
      "node_modules/lazysizes/lazysizes.min.js",
      "node_modules/jquery/dist/jquery.min.js",
      "node_modules/bootstrap/dist/js/bootstrap.min.js",
      "node_modules/slick-carousel/slick/slick.min.js",
      "node_modules/swiper/swiper-bundle.min.js",
      "./src/js/masked-input.js",
      `${DIST}/js/common*.min.js`,
    ])
    .pipe(concat("main.js"))
    .pipe(hash({ format: "{name}-{hash:8}{ext}" }))
    .pipe(
      rename(function (path) {
        path.basename += ".min";
        hashedJS = "js/" + path.basename + ".js";
      }),
    )
    .pipe(gulp.dest(`${DIST}/js`))
    .pipe(connect.reload());
});

//
// HTML
//
gulp.task("minifyhtml", function () {
  return gulp
    .src("./src/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(
      htmlreplace({
        css: hashedCSS,
        js: hashedJS,
      }),
    )
    .pipe(gulp.dest(DIST))
    .pipe(connect.reload());
});

//
// COPY ASSETS
//

gulp.task("copy-json", () =>
  gulp.src("./src/json/*").pipe(gulp.dest(`${DIST}/json`)),
);
gulp.task("fonts", function () {
  return gulp
    .src(["./src/fonts/**/*", "node_modules/slick-carousel/slick/fonts/*"])
    .pipe(gulp.dest("dist/fonts"));
});
//
// CLEAN DIST
//
gulp.task("clean-dist", function () {
  return gulp.src(DIST, { read: false, allowEmpty: true }).pipe(clean());
});

// function cleanCss() {
//   return gulp
//     .src(["./src/css/style.css"], { read: false, allowEmpty: true })
//     .pipe(clean());
// }

// function cleanJS() {
//   return gulp
//     .src(["./src/js/common.min.js"], { read: false, allowEmpty: true })
//     .pipe(clean());
// }

//
// SERVER (з dist)
//
gulp.task("connect", function () {
  var server = connect.server({
    root: DIST,
    livereload: true,
  });

  return gulp.src(`${DIST}/*.html`).pipe(
    open({
      uri: "http://" + server.host + ":" + server.port,
    }),
  );
});

// function ftpDeploy() {
//   var conn = ftp.create({
//     host: process.env.FTP_HOST,
//     user: process.env.FTP_USER,
//     password: process.env.FTP_PASS,
//     parallel: 5,
//     log: fancy.log,
//   });
//   const globs = [
//     "dist/**",
//     "!node_modules/**",
//     "!.git/**",
//     "!.gitlab-ci.yml",
//     "!.env",
//   ];
//   return gulp
//     .src(globs, { buffer: false })
//     .pipe(conn.dest("/var/www/test.lexstatus.com.ua/teploviziyne-obstezhennya"));
// }

//
// WATCH
//
function watchFiles() {
  gulp.watch(
    "./src/scss/*.scss",
    gulp.series("clean-css", "styles", "minifyhtml"),
  );
  gulp.watch("./src/*.html", gulp.series("minifyhtml"));
  gulp.watch("./src/img/svg/*.svg", gulp.series(["svg-sprite"]));
  gulp.watch(js, gulp.series("minify-main-js", "scripts", "minifyhtml"));
  gulp.watch(
    "./src/img/**/*",
    gulp.series(["image-to-webp", "image-min", "svg-sprite"]),
  );
}

//
// BUILD
//
const build = gulp.series(
  "clean-css",
  "clean-js",
  "styles",
  "minify-main-js",
  "scripts",
  "minifyhtml",
  "copy-json",
  "fonts",
  "image-to-webp",
  "image-min",
  "svg-sprite",
);

exports.build = build;
// exports.deploy = gulp.series(build, ftpDeploy);
exports.default = gulp.series(build, gulp.parallel("connect", watchFiles));
