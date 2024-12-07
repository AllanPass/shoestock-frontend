// Configuração global da aplicação
window.config = {
    // URL base da API
    apiBaseUrl: 'http://localhost:3001',
    defaultImageUrl: './images/no-image.png',
    
    // Configurações de paginação
    pagination: {
        itemsPerPage: 10,
        maxPages: 5
    },
    
    // Configurações de autenticação
    auth: {
        tokenKey: 'auth_token',
        userKey: 'user_data'
    }
};
