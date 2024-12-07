class ProdutosService {
    constructor() {
        this.baseUrl = window.config.apiBaseUrl + '/api/produtos';
    }

    getAuthToken() {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('Usuário não autenticado');
        }
        return token;
    }

    async getProducts(params = {}) {
        try {
            // Constrói os parâmetros da query
            const queryParams = new URLSearchParams();
            
            // Paginação
            if (params.page) queryParams.append('page', params.page);
            if (params.limit) queryParams.append('limit', params.limit);
            
            // Filtros
            if (params.busca) queryParams.append('search', params.busca);
            if (params.categoria) queryParams.append('category', params.categoria);
            if (params.precoMin) queryParams.append('minPrice', params.precoMin);
            if (params.precoMax) queryParams.append('maxPrice', params.precoMax);
            
            // Ordenação
            if (params.ordenarPor) queryParams.append('sortBy', params.ordenarPor);
            if (params.ordem) queryParams.append('order', params.ordem);

            const response = await fetch(`${this.baseUrl}?${queryParams.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`
                }
            });
            
            if (!response.ok) {
                if (response.status === 401) {
                    // Redireciona para login se não estiver autenticado
                    window.location.href = '/login.html';
                    throw new Error('Sessão expirada. Por favor, faça login novamente.');
                }
                const error = await response.json();
                throw new Error(error.message || 'Erro ao buscar produtos');
            }
            
            const responseData = await response.json();
            
            // Trata diferentes formatos de resposta
            let formattedData;
            if (Array.isArray(responseData)) {
                formattedData = {
                    items: responseData,
                    total: responseData.length,
                    page: params.page || 1
                };
            } else if (responseData.produtos) {
                formattedData = {
                    items: responseData.produtos,
                    total: responseData.total || responseData.produtos.length,
                    page: responseData.pagina || params.page || 1
                };
            } else {
                formattedData = responseData;
            }

            return { success: true, data: formattedData };
        } catch (error) {
            console.error('Erro no getProducts:', error);
            return { success: false, error: error.message };
        }
    }

    async getProduct(id) {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`
                }
            });
            
            if (!response.ok) {
                if (response.status === 401) {
                    window.location.href = '/login.html';
                    throw new Error('Sessão expirada. Por favor, faça login novamente.');
                }
                const error = await response.json();
                throw new Error(error.message || 'Erro ao buscar produto');
            }
            
            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.error('Erro no getProduct:', error);
            return { success: false, error: error.message };
        }
    }

    async createProduct(productData) {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: JSON.stringify(productData)
            });
            
            if (!response.ok) {
                if (response.status === 401) {
                    window.location.href = '/login.html';
                    throw new Error('Sessão expirada. Por favor, faça login novamente.');
                }
                const error = await response.json();
                throw new Error(error.message || 'Erro ao criar produto');
            }
            
            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.error('Erro no createProduct:', error);
            return { success: false, error: error.message };
        }
    }

    async updateProduct(id, formData) {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: formData
            });

            if (!response.ok) {
                if (response.status === 401) {
                    window.location.href = '/login.html';
                    throw new Error('Sessão expirada. Por favor, faça login novamente.');
                }
                const error = await response.json();
                throw new Error(error.message || 'Erro ao atualizar produto');
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
            return { success: false, error: error.message };
        }
    }

    async deleteProduct(id) {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    window.location.href = '/login.html';
                    throw new Error('Sessão expirada. Por favor, faça login novamente.');
                }
                const error = await response.json();
                throw new Error(error.message || 'Erro ao excluir produto');
            }

            return { success: true };
        } catch (error) {
            console.error('Erro ao excluir produto:', error);
            return { success: false, error: error.message };
        }
    }
}

// Inicializa o serviço globalmente
window.produtosService = new ProdutosService();
