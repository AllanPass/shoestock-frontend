// Gerenciamento de tema
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const sidebar = document.querySelector('nav');

    // Inicializa o tema
    const currentTheme = localStorage.getItem('theme') || 'light';
    body.dataset.theme = currentTheme;
    themeToggle.checked = currentTheme === 'dark';

    // Toggle do tema
    themeToggle.addEventListener('change', () => {
        const newTheme = themeToggle.checked ? 'dark' : 'light';
        body.dataset.theme = newTheme;
        localStorage.setItem('theme', newTheme);
    });

    // Menu móvel
    if (mobileMenuButton && mobileOverlay && sidebar) {
        mobileMenuButton.addEventListener('click', () => {
            sidebar.classList.toggle('-translate-x-full');
            mobileOverlay.classList.toggle('hidden');
        });

        mobileOverlay.addEventListener('click', () => {
            sidebar.classList.add('-translate-x-full');
            mobileOverlay.classList.add('hidden');
        });
    }
});

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
