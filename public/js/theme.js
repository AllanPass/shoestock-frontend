// Gerenciamento de tema
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Carregar tema salvo
const savedTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', savedTheme);
themeToggle.checked = savedTheme === 'dark';

// Alternar tema
themeToggle.addEventListener('change', () => {
    const newTheme = themeToggle.checked ? 'dark' : 'light';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Menu móvel
const mobileMenuButton = document.getElementById('mobile-menu-button');
const nav = document.querySelector('nav');
const overlay = document.getElementById('mobile-overlay');

if (mobileMenuButton && nav && overlay) {
    mobileMenuButton.addEventListener('click', () => {
        nav.classList.toggle('-translate-x-full');
        overlay.classList.toggle('hidden');
    });

    overlay.addEventListener('click', () => {
        nav.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
    });
}

// Funções de feedback
function showFeedback(message, type = 'success') {
    const feedback = document.createElement('div');
    feedback.className = `feedback-message feedback-${type}`;
    feedback.textContent = message;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.style.opacity = '0';
        setTimeout(() => feedback.remove(), 300);
    }, 3000);
}

// Inicializar ícones Feather
if (typeof feather !== 'undefined') {
    feather.replace();
}
