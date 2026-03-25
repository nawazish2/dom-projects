# API Data Fetching Dashboard

This is a small DOM project built with plain HTML, CSS, and JavaScript.

It pulls data from JSONPlaceholder and shows it on the page without using any framework. The idea was to practice working with `fetch()`, rendering API data into the DOM, and handling basic UI states like loading and errors.

## What it does

- loads data from a public API
- switches between posts and users
- lets you change how many items are shown
- refreshes the current view
- shows loading and error messages

## Built with

- HTML
- CSS
- JavaScript

Nothing else is used here.

## Project files

- `index.html` for the page structure
- `style.css` for layout and styling
- `main.js` for fetching data and updating the DOM

## How it works

The HTML sets up the buttons, select input, status text, and results area.

The CSS handles the visual layout, card styles, spacing, and responsive behavior.

The JavaScript does the main work:

- listens for button and select changes
- calls the API with `fetch()`
- handles loading and failed requests
- creates the result cards
- inserts them into the page

## API used

- `https://jsonplaceholder.typicode.com/posts`
- `https://jsonplaceholder.typicode.com/users`

## Run locally

From the `dom-projects` folder:

```bash
python3 -m http.server 8001
```

Then open:

`http://localhost:8001/04-api-data-fetching/`
