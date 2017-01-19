var gulp = require('gulp');
var del = require('del');
var imageResize = require('gulp-image-resize');
var rename = require("gulp-rename");
var imageOptimize = require('gulp-image-optimization'); // @todo: reimplement this

// nb: you will also need to integrate gulp-compass to auto process Sass

// Process images
gulp.task('images', function () {
    del('./app/img/*_*.jpg').then(function() {
        var images = gulp.src(['app/img/*.jpg']);

        /**
         * Converts an original image to a max width
         * @param  {path} images      A list of images (from gulp.src)
         * @param  {string} suffix      Name of the format (eg. desktop, tablet…)
         * @param  {int} targetWidth The maximum width for this device size
         */
        function convert(images, suffix, targetWidth) {
            images.pipe(imageResize({ width: targetWidth, imageMagick: true, filter: 'Catrom' }))
                .pipe(rename(function (path) { path.basename += "_" + suffix; }))
                .pipe(gulp.dest('dist/img'));

            // make a hi-dpi version by multiplying the max width by 2
            // nb: we reduce the quality to 65% to get a much lower filesize and still good quality
            // because JPEG artifacts on "scaled down" imgs won't be visible on hi-dpi displays, but still
            // look crisp. see https://www.netvlies.nl/tips-updates/algemeen/algemeen/retina-revolution/
            return images.pipe(imageResize({ width: targetWidth * 2, imageMagick: true, filter: 'Catrom', quality: 0.65 }))
                .pipe(rename(function (path) { path.basename += "_" + suffix + "@2x"; }))
                .pipe(gulp.dest('dist/img'));
        }

        // Here's 3 presets, change as needed (remember to apply changes in Sass file)
        convert(images, 'desktop', 1300);
        convert(images, 'tablet', 780);
        convert(images, 'mobile', 380);
    });
});
