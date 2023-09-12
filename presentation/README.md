# SSE-Presentation source

This directory includes the source and built presentation.

The source is the `source.md` markdown file. The target is `index.html`.

## Requirements

Pandoc & nodemon.

`./gen.sh` requires pandoc. You can find instructions on installing pandoc on your machine [here](https://pandoc.org/installing.html).

`./gen-watch.sh` requires nodemon. You can install that globally with `npm i -g nodemon` or `yarn global add nodemon`.

## Running

Running `./gen.sh` will rebuild the target `index.html`.

Running `./gen-watch.sh` will watch the current directory for changes to `.md` or `.slidy` files and run `gen.sh` when any change is detected.

## Configuring

The presentation include some reasonable defaults and styling for kadena-themed presentations.

### Markdown metadata

The header of the source markdown file includes the following variables that can be set. Refer to `source.md` contents for an example.

|name|description|
|----|-----------|
|title|Presentation title. Ends up in title slide, page title|
|title-prefix|Presentation prefix for html page title|
|author|Ends up in title slide, page meta author|
|date|Ends up in title slide, page meta date|
|icons|List of image sources to show as icons over the title on the title slide. can be omitted|
|video|List of `{.src, .type}` for video sources for the background of the title slide (or the entire presentation)|
|video_playback_rate|custom playback rate for the video|
|slide_bg_is_video|`true` to use the video as presentation background, `false` to use image instead|
|background|image background for presentation if `video` is missing or `slide_bg_is_video` is `false`|

### Slidy template

The js slideshow library used is `slidy`.

The template file which generates the html is `assets/kadena.slidy`.

### Stylesheets

CSS stylesheets can be tweaked under `assets/styles/`.

If you want to pick different colors or tones, please consult the [Color System](https://www.figma.com/file/cNQkFOjrqO3PAYv7TSIhpB/Foundation?type=design&node-id=188-869&mode=design&t=5J7YpU6yxy8El0DC-0).
