class Auth {
    constructor() {
        this.isAuthenticated = false;
        this.isAdmin = false;
        this.checkAuth();
    }

    checkAuth() {
        const token = localStorage.getItem('authToken');
        const userRole = localStorage.getItem('userRole');
        
        if (token) {
            this.isAuthenticated = true;
            this.isAdmin = userRole === 'admin';
        }
    }

    getToken() {
        return localStorage.getItem('authToken');
    }

    login(username, password) {
        // Simulando uma autenticação básica
        if (username === 'admin' && password === 'admin123') {
            const token = 'admin-token-' + Date.now(); // Token simulado
            localStorage.setItem('authToken', token);
            localStorage.setItem('userRole', 'admin');
            this.isAuthenticated = true;
            this.isAdmin = true;
            return true;
        }
        return false;
    }

    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        this.isAuthenticated = false;
        this.isAdmin = false;
        window.location.href = '/login.html';
    }

    requireAdmin() {
        if (!this.isAdmin) {
            window.location.href = '/login.html';
        }
    }
}

// Instância global
window.auth = new Auth();
