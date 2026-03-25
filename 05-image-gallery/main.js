const gallery = document.getElementById("gallery");
const galleryStatus = document.getElementById("gallery-status");
const countSelect = document.getElementById("count-select");
const searchInput = document.getElementById("search-input");
const shuffleButton = document.getElementById("shuffle-btn");
const layoutButtons = Array.from(document.querySelectorAll(".layout-btn"));
const modal = document.getElementById("modal");
const modalImage = document.getElementById("modal-image");
const modalTitle = document.getElementById("modal-title");
const modalLink = document.getElementById("modal-link");
const closeModalButton = document.getElementById("close-modal");

let photos = [];
let layout = "grid";

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

function setStatus(message, isError = false) {
    galleryStatus.textContent = message;
    galleryStatus.style.color = isError ? "#9f2d2d" : "";
}

function applyLayout(nextLayout) {
    layout = nextLayout;
    gallery.className = `gallery gallery-${nextLayout}`;
    layoutButtons.forEach((button) => {
        button.classList.toggle("is-active", button.dataset.layout === nextLayout);
    });
}

function filteredPhotos() {
    const term = searchInput.value.trim().toLowerCase();

    if (!term) {
        return photos;
    }

    return photos.filter((photo) => photo.author.toLowerCase().includes(term));
}

function renderGallery() {
    const visiblePhotos = filteredPhotos();

    if (!visiblePhotos.length) {
        gallery.innerHTML = `
            <div class="empty">
                <p>No images match that author filter.</p>
            </div>
        `;
        setStatus("No results for the current filter.");
        return;
    }

    gallery.innerHTML = visiblePhotos.map((photo, index) => `
        <article class="gallery-card ${index % 3 === 0 ? "tall" : ""}">
            <img src="${photo.download_url}" alt="Photo by ${escapeHtml(photo.author)}">
            <div class="card-copy">
                <p>Photo by</p>
                <h2>${escapeHtml(photo.author)}</h2>
                <div class="card-actions">
                    <small>ID ${photo.id}</small>
                    <button class="preview-btn" type="button" data-photo-id="${photo.id}">Preview</button>
                </div>
            </div>
        </article>
    `).join("");

    setStatus(`Showing ${visiblePhotos.length} image${visiblePhotos.length === 1 ? "" : "s"}.`);
}

async function loadPhotos() {
    const count = Number(countSelect.value);
    const page = Math.floor(Math.random() * 15) + 1;

    gallery.innerHTML = "";
    setStatus(`Loading ${count} images...`);
    shuffleButton.disabled = true;

    try {
        const response = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=${count}`);

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        photos = await response.json();
        renderGallery();
    } catch (error) {
        photos = [];
        gallery.innerHTML = `
            <div class="empty">
                <p>Could not load images right now. Try again in a moment.</p>
            </div>
        `;
        setStatus(error.message, true);
    } finally {
        shuffleButton.disabled = false;
    }
}

function openModal(photoId) {
    const selected = photos.find((photo) => String(photo.id) === String(photoId));

    if (!selected) {
        return;
    }

    modalImage.src = selected.download_url;
    modalImage.alt = `Photo by ${selected.author}`;
    modalTitle.textContent = selected.author;
    modalLink.href = selected.url;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    modalImage.src = "";
}

countSelect.addEventListener("change", loadPhotos);
searchInput.addEventListener("input", renderGallery);
shuffleButton.addEventListener("click", loadPhotos);

layoutButtons.forEach((button) => {
    button.addEventListener("click", () => applyLayout(button.dataset.layout));
});

gallery.addEventListener("click", (event) => {
    const previewButton = event.target.closest(".preview-btn");

    if (previewButton) {
        openModal(previewButton.dataset.photoId);
    }
});

modal.addEventListener("click", (event) => {
    if (event.target.dataset.close === "true") {
        closeModal();
    }
});

closeModalButton.addEventListener("click", closeModal);

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeModal();
    }
});

applyLayout(layout);
loadPhotos();
