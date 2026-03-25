# Image Gallery Explorer

This project is a simple image gallery made with plain HTML, CSS, and JavaScript.

It fetches images from Picsum and shows them in a clean gallery layout. I added a few interactions so it feels like a proper DOM project instead of just a static image grid.

## What it does

- loads images from a public API
- lets you choose how many images to fetch
- filters images by author name
- switches between grid and masonry layouts
- opens a larger preview in a modal
- shows loading and error states

## Built with

- HTML
- CSS
- JavaScript

No library or framework is used.

## Project files

- `index.html` for the page layout and modal structure
- `style.css` for gallery styling and responsive layout
- `main.js` for fetching images and handling interactions

## How it works

The HTML contains the controls, gallery container, and modal markup.

The CSS styles the gallery cards, buttons, modal, and both layout modes.

The JavaScript:

- fetches image data from Picsum
- stores the images in memory
- filters them based on the search input
- updates the gallery when the layout changes
- opens and closes the preview modal

## API used

- `https://picsum.photos/v2/list`

## Run locally

From the `dom-projects` folder:

```bash
python3 -m http.server 8001
```

Then open:

`http://localhost:8001/05-image-gallery/`
