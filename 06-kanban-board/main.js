const STORAGE_KEY = "dom-projects-kanban-board";
const COLUMN_ORDER = ["todo", "inprogress", "done"];
const COLUMN_META = {
    todo: { title: "To Do" },
    inprogress: { title: "In Progress" },
    done: { title: "Done" },
};

const board = document.getElementById("board");
const boardStatus = document.getElementById("board-status");
const taskForm = document.getElementById("task-form");
const titleInput = document.getElementById("task-title");
const detailsInput = document.getElementById("task-details");
const columnInput = document.getElementById("task-column");

let state = loadState();

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
        };

        return entities[char];
    });
}

function createInitialState() {
    return {
        todo: [],
        inprogress: [],
        done: [],
    };
}

function loadState() {
    const savedState = localStorage.getItem(STORAGE_KEY);

    if (!savedState) {
        return createInitialState();
    }

    try {
        const parsed = JSON.parse(savedState);
        return {
            todo: Array.isArray(parsed.todo) ? parsed.todo : [],
            inprogress: Array.isArray(parsed.inprogress) ? parsed.inprogress : [],
            done: Array.isArray(parsed.done) ? parsed.done : [],
        };
    } catch {
        return createInitialState();
    }
}

function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function setStatus(message) {
    boardStatus.textContent = message;
}

function buildMoveButtons(columnKey, taskId) {
    const columnIndex = COLUMN_ORDER.indexOf(columnKey);
    const buttons = [];

    if (columnIndex > 0) {
        buttons.push(`
            <button class="move-btn" type="button" data-action="move" data-direction="left" data-task-id="${taskId}">
                Move Left
            </button>
        `);
    }

    if (columnIndex < COLUMN_ORDER.length - 1) {
        buttons.push(`
            <button class="move-btn" type="button" data-action="move" data-direction="right" data-task-id="${taskId}">
                Move Right
            </button>
        `);
    }

    return buttons.join("");
}

function renderBoard() {
    board.innerHTML = COLUMN_ORDER.map((columnKey) => {
        const tasks = state[columnKey];

        const taskMarkup = tasks.length
            ? tasks.map((task) => `
                <article class="task-card">
                    <h3>${escapeHtml(task.title)}</h3>
                    <p>${task.details ? escapeHtml(task.details) : "No details added yet."}</p>
                    <div class="task-actions">
                        <button class="edit-btn" type="button" data-action="edit" data-task-id="${task.id}" data-column="${columnKey}">Edit</button>
                        <button class="delete-btn" type="button" data-action="delete" data-task-id="${task.id}" data-column="${columnKey}">Delete</button>
                    </div>
                    <div class="task-move">
                        ${buildMoveButtons(columnKey, task.id)}
                    </div>
                </article>
            `).join("")
            : `<div class="empty-column"><p>No tasks in ${COLUMN_META[columnKey].title}.</p></div>`;

        return `
            <section class="column ${columnKey}">
                <header class="column-header">
                    <h2>${COLUMN_META[columnKey].title}</h2>
                    <span class="task-count">${tasks.length} task${tasks.length === 1 ? "" : "s"}</span>
                </header>
                <div class="task-list">
                    ${taskMarkup}
                </div>
            </section>
        `;
    }).join("");
}

function addTask(title, details, column) {
    state[column].unshift({
        id: crypto.randomUUID(),
        title,
        details,
    });

    saveState();
    renderBoard();
    setStatus(`Added "${title}" to ${COLUMN_META[column].title}.`);
}

function deleteTask(column, taskId) {
    const task = state[column].find((item) => item.id === taskId);
    state[column] = state[column].filter((item) => item.id !== taskId);
    saveState();
    renderBoard();
    setStatus(`Deleted "${task ? task.title : "task"}".`);
}

function moveTask(taskId, direction) {
    const currentColumn = COLUMN_ORDER.find((columnKey) =>
        state[columnKey].some((task) => task.id === taskId)
    );

    if (!currentColumn) {
        return;
    }

    const currentIndex = COLUMN_ORDER.indexOf(currentColumn);
    const nextIndex = direction === "left" ? currentIndex - 1 : currentIndex + 1;
    const nextColumn = COLUMN_ORDER[nextIndex];

    if (!nextColumn) {
        return;
    }

    const taskIndex = state[currentColumn].findIndex((task) => task.id === taskId);
    const [task] = state[currentColumn].splice(taskIndex, 1);
    state[nextColumn].unshift(task);

    saveState();
    renderBoard();
    setStatus(`Moved "${task.title}" to ${COLUMN_META[nextColumn].title}.`);
}

function editTask(column, taskId) {
    const task = state[column].find((item) => item.id === taskId);

    if (!task) {
        return;
    }

    const nextTitle = window.prompt("Update task title:", task.title);

    if (nextTitle === null) {
        return;
    }

    const trimmedTitle = nextTitle.trim();

    if (!trimmedTitle) {
        setStatus("Task title cannot be empty.");
        return;
    }

    const nextDetails = window.prompt("Update task details:", task.details);

    if (nextDetails === null) {
        return;
    }

    task.title = trimmedTitle;
    task.details = nextDetails.trim();
    saveState();
    renderBoard();
    setStatus(`Updated "${task.title}".`);
}

taskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = titleInput.value.trim();
    const details = detailsInput.value.trim();
    const column = columnInput.value;

    if (!title) {
        setStatus("Task title is required.");
        return;
    }

    addTask(title, details, column);
    taskForm.reset();
    columnInput.value = "todo";
    titleInput.focus();
});

board.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    const { action, taskId, column, direction } = button.dataset;

    if (action === "delete") {
        deleteTask(column, taskId);
    }

    if (action === "edit") {
        editTask(column, taskId);
    }

    if (action === "move") {
        moveTask(taskId, direction);
    }
});

renderBoard();
setStatus("Board ready. Tasks are saved automatically in localStorage.");
