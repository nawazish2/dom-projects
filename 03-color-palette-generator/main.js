const generateBtn = document.getElementById('generate-btn');
const themeBtn = document.getElementById('theme-btn');
const colorCount = document.getElementById('color-count');
const countDisplay = document.getElementById('count-display');
const paletteGrid = document.getElementById('palette-grid');
const toast = document.getElementById('toast');
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

// generate random hex color
function randomHex() {
    return '#' + Math.floor(Math.random() * 0xFFFFFF)
        .toString(16).padStart(6, '0');
}

// render palette
function renderPalette() {
    const count = parseInt(colorCount.value);
    paletteGrid.innerHTML = '';

    for (let i = 0; i < count; i++) {
        const hex = randomHex();

        const swatch = document.createElement('div');
        swatch.className = 'swatch';
        swatch.style.backgroundColor = hex;

        const hexLabel = document.createElement('span');
        hexLabel.className = 'swatch-hex';
        hexLabel.textContent = hex;

        swatch.appendChild(hexLabel);

        // click to copy
        swatch.addEventListener('click', () => {
            navigator.clipboard.writeText(hex).then(() => {
                toast.textContent = `Copied ${hex}`;
                setTimeout(() => toast.textContent = '', 2000);
            }).catch(() => {
                toast.textContent = `${hex}`;
            });
        });

        paletteGrid.appendChild(swatch);
    }
}

// update count display on slider change
colorCount.addEventListener('input', () => {
    countDisplay.textContent = colorCount.value;
    renderPalette();
});

// generate on button click
generateBtn.addEventListener('click', renderPalette);

// generate on load
renderPalette();