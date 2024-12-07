// Serviço de banco de dados
class DatabaseService {
    constructor() {
        this.baseUrl = 'http://localhost:3001/api'; // URL da sua API
        this.categorias = [
            'Masculino',
            'Feminino',
            'Infantil Masculino',
            'Infantil Feminino',
            'Baby Masculino',
            'Baby Feminino'
        ];
    }

    // GET - Buscar todos os produtos
    async getProducts(page = 1, limit = 10, filters = {}) {
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                ...filters
            });

            const response = await fetch(`${this.baseUrl}/produtos?${queryParams}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `Erro ao buscar produtos: ${response.statusText}`);
            }

            const data = await response.json();
            return {
                data: data.data || [],
                total: data.total || 0,
                currentPage: data.currentPage || page,
                totalPages: data.totalPages || 1
            };
        } catch (error) {
            console.error('Erro na requisição:', error);
            throw error;
        }
    }

    // POST - Adicionar novo produto
    async addProduct(product) {
        try {
            if (!this.validateProduct(product)) {
                throw new Error('Dados do produto inválidos');
            }

            // Converte a imagem para base64 se necessário
            if (product.imagem instanceof File) {
                product.imagem = await this.fileToBase64(product.imagem);
            }

            const response = await fetch(`${this.baseUrl}/produtos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                mode: 'cors',
                credentials: 'same-origin',
                body: JSON.stringify(product)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `Erro ao adicionar produto: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao adicionar produto:', error);
            throw error;
        }
    }

    // PUT - Atualizar produto existente
    async updateProduct(id, product) {
        try {
            // Converte a imagem para base64 se necessário
            if (product.imagem instanceof File) {
                product.imagem = await this.fileToBase64(product.imagem);
            }

            const response = await fetch(`${this.baseUrl}/produtos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                mode: 'cors',
                credentials: 'same-origin',
                body: JSON.stringify(product)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `Erro ao atualizar produto: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro na requisição:', error);
            throw error;
        }
    }

    // DELETE - Excluir produto
    async deleteProduct(id) {
        try {
            const response = await fetch(`${this.baseUrl}/produtos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                },
                mode: 'cors',
                credentials: 'same-origin'
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `Erro ao excluir produto: ${response.statusText}`);
            }

            return true;
        } catch (error) {
            console.error('Erro na requisição:', error);
            throw error;
        }
    }

    // Buscar produto por ID
    async getProductById(id) {
        try {
            const response = await fetch(`${this.baseUrl}/produtos/${id}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                mode: 'cors',
                credentials: 'same-origin'
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `Erro ao buscar produto: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar produto:', error);
            throw error;
        }
    }

    // Método para obter categorias permitidas
    getCategorias() {
        return this.categorias;
    }

    // Validação de produto
    validateProduct(product) {
        const requiredFields = ['referencia', 'marca', 'descricao', 'preco', 'category'];
        for (const field of requiredFields) {
            if (!product[field]) {
                console.error(`Campo obrigatório ausente: ${field}`);
                return false;
            }
        }

        if (isNaN(product.preco) || parseFloat(product.preco) < 0) {
            console.error('Preço inválido');
            return false;
        }

        if (!product.category || !this.categorias.includes(product.category)) {
            throw new Error('Categoria inválida. Categorias permitidas: ' + this.categorias.join(', '));
        }
        return true;
    }

    // Função auxiliar para converter File para base64
    async fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
}

// Exporta uma instância do serviço
export const dbService = new DatabaseService();
