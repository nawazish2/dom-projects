const input = document.getElementById('list-input');
const addBtn = document.getElementById('add-btn');
const themeBtn = document.getElementById('theme-btn');
const ul = document.getElementById('list');
const html = document.documentElement;

// apply saved theme on load
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
themeBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

// theme toggle
themeBtn.addEventListener('click', () => {
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    themeBtn.textContent = isDark ? '🌙' : '☀️';
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
});

// show empty state
function showEmpty() {
    if (ul.children.length === 0) {
        const p = document.createElement('p');
        p.className = 'empty-msg';
        p.id = 'empty-msg';
        p.textContent = 'No items yet. Add one above.';
        ul.appendChild(p);
    }
}

// add item
function addItem() {
    const val = input.value.trim();
    if (!val) return;

    const empty = document.getElementById('empty-msg');
    if (empty) empty.remove();

    const li = document.createElement('li');

    const span = document.createElement('span');
    span.textContent = val;

    const delBtn = document.createElement('button');
    delBtn.textContent = '×';
    delBtn.className = 'del-btn';
    delBtn.addEventListener('click', () => {
        li.remove();
        showEmpty();
    });

    li.append(span, delBtn);
    ul.appendChild(li);

    input.value = '';
    input.focus();
}

addBtn.addEventListener('click', addItem);

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addItem();
});

showEmpty();