const DATASET_CONFIG = {
    posts: {
        label: "posts",
        endpoint: "https://jsonplaceholder.typicode.com/posts",
        renderItem: (item) => `
            <article class="card">
                <span class="card-tag">Post ${item.id}</span>
                <h2>${escapeHtml(item.title)}</h2>
                <p>${escapeHtml(item.body)}</p>
                <div class="meta">
                    <span>User ${item.userId}</span>
                    <span>Async UI</span>
                </div>
            </article>
        `,
    },
    users: {
        label: "users",
        endpoint: "https://jsonplaceholder.typicode.com/users",
        renderItem: (item) => `
            <article class="card">
                <span class="card-tag">${escapeHtml(item.company.name)}</span>
                <h2>${escapeHtml(item.name)}</h2>
                <p>${escapeHtml(item.email)}</p>
                <div class="meta">
                    <span>${escapeHtml(item.address.city)}</span>
                    <span>@${escapeHtml(item.username)}</span>
                </div>
            </article>
        `,
    },
};

const results = document.getElementById("results");
const statusMessage = document.getElementById("status-message");
const limitSelect = document.getElementById("limit-select");
const refreshButton = document.getElementById("refresh-btn");
const datasetButtons = Array.from(document.querySelectorAll(".dataset-btn"));

let currentResource = "posts";

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

function setActiveDataset(resource) {
    currentResource = resource;
    datasetButtons.forEach((button) => {
        button.classList.toggle("is-active", button.dataset.resource === resource);
    });
}

function setStatus(message, isError = false) {
    statusMessage.textContent = message;
    statusMessage.style.color = isError ? "#9f3822" : "";
}

function renderItems(items) {
    if (!items.length) {
        results.innerHTML = `
            <div class="empty-card">
                <p>No ${DATASET_CONFIG[currentResource].label} matched the current view.</p>
            </div>
        `;
        return;
    }

    results.innerHTML = items.map(DATASET_CONFIG[currentResource].renderItem).join("");
}

async function loadDataset() {
    const { endpoint, label } = DATASET_CONFIG[currentResource];
    const limit = Number(limitSelect.value);

    results.innerHTML = "";
    setStatus(`Loading ${limit} ${label}...`);
    refreshButton.disabled = true;

    try {
        const response = await fetch(endpoint);

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        const items = data.slice(0, limit);

        renderItems(items);
        setStatus(`Showing ${items.length} ${label}.`);
    } catch (error) {
        results.innerHTML = `
            <div class="empty-card">
                <p>Unable to load ${label}. Check your network and try again.</p>
            </div>
        `;
        setStatus(error.message, true);
    } finally {
        refreshButton.disabled = false;
    }
}

datasetButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const { resource } = button.dataset;
        if (resource === currentResource) {
            return;
        }

        setActiveDataset(resource);
        loadDataset();
    });
});

limitSelect.addEventListener("change", loadDataset);
refreshButton.addEventListener("click", loadDataset);

setActiveDataset(currentResource);
loadDataset();
