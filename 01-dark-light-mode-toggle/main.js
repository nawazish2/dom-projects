const button = document.querySelector('button');
const html = document.documentElement;

button.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    html.setAttribute('data-theme', currentTheme === 'dark' ? 'light' : 'dark');
});