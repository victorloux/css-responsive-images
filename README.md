This was a fairly experimental automation tool to automatically resize a set of images in 6 different predefined widths (desktop, tablet, mobile, plus a hi-dpi version for each), and load the appropriate version using CSS media queries, to save bandwidth and processing time on smaller devices when you have very large background images.

Single image input: **andromeda.jpg**, 6200⨉6200, 4.3 Mb

Output:

| Device          | filename                 | Dimensions | Size   |
|-----------------|--------------------------|------------|--------|
| Desktop         | andromeda_desktop.jpg    | 1300⨉1300  | 184 kb |
| Desktop, hi-dpi | andromeda_desktop@2x.jpg | 2600⨉2600  | 534 kb |
| Tablet          | andromeda_tablet.jpg     | 780⨉780    | 68 kb  |
| Tablet, hi-dpi  | andromeda_tablet@2x.jpg  | 1560⨉1560  | 203 kb |
| Mobile          | andromeda_mobile.jpg     | 380⨉380    | 16 kb  |
| Mobile, hi-dpi  | andromeda_mobile@2x.jpg  | 760⨉760    | 50 kb  |

This was made a few years back because there were few CSS-only solutions to do this and I was working on a website with many, very large photos in the background so this was needed for performance, and automation came in very handy. **I'm sure there are better tools and packages for doing this now, this was experimental and may produce fairly inefficient code** (see below), please look for the alternatives if you intend to use it for production. I'm mostly posting it in case anyone wants to build on it, or needs a quick hack for a prototype.

# Demo

[Right there](http://victorloux.github.io/css-responsive-images/).

# Usage

To resize and optimise all of the original images from **app/img** into **dist/img**, run `gulp images`. This may take a while.

In your sass files, replace any occurence of `background-image` by the mixin `+image`, omitting the extension, like so:

```sass
body
	+responsiveimage("andromeda")
```

This will compile into the absolutely less concise:

```css
/* line 3, ../sass/style.sass */
body {
  background-image: url(../img/andromeda_desktop.jpg);
}
@media only screen and (-webkit-min-device-pixel-ratio: 1.5), only screen and (min--moz-device-pixel-ratio: 1.5), only screen and (-o-min-device-pixel-ratio: 1.5 / 1), only screen and (min-resolution: 144dpi), only screen and (min-resolution: 1.5dppx) {
  /* line 3, ../sass/style.sass */
  body {
    background-image: url(../img/andromeda_desktop@2x.jpg);
  }
}
@media only screen and (max-device-width: 980px) and (orientation: portrait), only screen and (max-width: 980px) {
  /* line 3, ../sass/style.sass */
  body {
    background-image: url(../img/andromeda_tablet.jpg);
  }
}
@media only screen and (-webkit-min-device-pixel-ratio: 1.5) and (max-device-width: 980px) and (orientation: portrait), only screen and (min--moz-device-pixel-ratio: 1.5) and (max-device-width: 980px) and (orientation: portrait), only screen and (-o-min-device-pixel-ratio: 1.5 / 1) and (max-device-width: 980px) and (orientation: portrait), only screen and (min-resolution: 144dpi) and (max-device-width: 980px) and (orientation: portrait), only screen and (min-resolution: 1.5dppx) and (max-device-width: 980px) and (orientation: portrait), only screen and (-webkit-min-device-pixel-ratio: 1.5) and (max-width: 980px), only screen and (min--moz-device-pixel-ratio: 1.5) and (max-width: 980px), only screen and (-o-min-device-pixel-ratio: 1.5 / 1) and (max-width: 980px), only screen and (min-resolution: 144dpi) and (max-width: 980px), only screen and (min-resolution: 1.5dppx) and (max-width: 980px) {
  /* line 3, ../sass/style.sass */
  body {
    background-image: url(../img/andromeda_tablet@2x.jpg);
  }
}

@media only screen and (max-device-width: 380px), only screen and (max-width: 380px) {
  /* line 3, ../sass/style.sass */
  body {
    background-image: url(../img/andromeda_mobile.jpg);
  }
}
@media only screen and (-webkit-min-device-pixel-ratio: 1.5) and (max-device-width: 380px), only screen and (min--moz-device-pixel-ratio: 1.5) and (max-device-width: 380px), only screen and (-o-min-device-pixel-ratio: 1.5 / 1) and (max-device-width: 380px), only screen and (min-resolution: 144dpi) and (max-device-width: 380px), only screen and (min-resolution: 1.5dppx) and (max-device-width: 380px), only screen and (-webkit-min-device-pixel-ratio: 1.5) and (max-width: 380px), only screen and (min--moz-device-pixel-ratio: 1.5) and (max-width: 380px), only screen and (-o-min-device-pixel-ratio: 1.5 / 1) and (max-width: 380px), only screen and (min-resolution: 144dpi) and (max-width: 380px), only screen and (min-resolution: 1.5dppx) and (max-width: 380px) {
  /* line 3, ../sass/style.sass */
  body {
    background-image: url(../img/andromeda_mobile@2x.jpg);
  }
}
```

Hurray! Now smaller devices will only load the appropriate image for their size and pixel ratio.

## Isn't this stupidly long code, for saving bandwidth on images?

Yes, but the theory is that later on in your development process you'll use a CSS minifier/optimiser and it will put all these background-image declarations together under one media query for every size+ratio, so if you have a lot of background images that should be loaded responsively, then it won't spit out that code for every image. On rich pages this might add 3kb of CSS for saving several megabytes on bandwidth.

Also keep in mind here that what takes a lot of the space here is repetition, due to browser prefixes (-moz- and -webkit-). You could modify the media queries to remove them, and use [-prefix-free](http://leaverou.github.com/prefixfree/). (But then you'd use Javascript for styles and the whole point of this PoC was that you can achieve effortless responsive images without any client-side JS.)