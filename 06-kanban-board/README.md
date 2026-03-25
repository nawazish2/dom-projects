# Kanban Flow Board

This is a browser-based kanban board built with only HTML, CSS, and JavaScript.

The main focus here was DOM rendering and client-side state management. Tasks are stored in `localStorage`, so the board keeps its data even after a refresh.

## What it does

- adds new tasks
- shows tasks in three columns
- edits task title and details
- deletes tasks
- moves tasks between columns
- saves everything in `localStorage`

## Built with

- HTML
- CSS
- JavaScript

There are no external packages in this project.

## Project files

- `index.html` for the form and board structure
- `style.css` for layout and task card styling
- `main.js` for rendering, state updates, and storage

## How it works

The HTML provides the task form and the main board container.

The CSS handles the three-column layout, card styles, buttons, and mobile layout changes.

The JavaScript:

- keeps the board state in a plain object
- renders tasks into each column
- saves and loads data with `localStorage`
- handles add, edit, delete, and move actions

## Storage used

- `localStorage`

Storage key:

- `dom-projects-kanban-board`

## Run locally

From the `dom-projects` folder:

```bash
python3 -m http.server 8001
```

Then open:

`http://localhost:8001/06-kanban-board/`
