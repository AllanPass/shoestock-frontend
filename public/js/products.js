import { dbService } from './services/database.service.js';
import { ui } from './ui.js';

// Gerenciamento de produtos
class ProductManager {
    constructor() {
        this.dbService = dbService;
    }

    // Obtém todos os produtos
    async getProducts() {
        try {
            return await this.dbService.getProducts();
        } catch (error) {
            ui.showFeedback('Erro ao carregar produtos', 'error');
            console.error('Erro ao carregar produtos:', error);
            return [];
        }
    }

    // Adiciona um novo produto
    async addProduct(product) {
        try {
            // Validação básica
            if (!this.validateProduct(product)) {
                throw new Error('Dados do produto inválidos');
            }

            // Sanitização dos dados
            product = this.sanitizeProduct(product);

            // Salva no banco de dados
            await this.dbService.addProduct(product);
            ui.showFeedback('Produto adicionado com sucesso', 'success');
            return true;
        } catch (error) {
            ui.showFeedback('Erro ao adicionar produto', 'error');
            console.error('Erro ao adicionar produto:', error);
            throw error;
        }
    }

    // Atualiza um produto existente
    async updateProduct(id, product) {
        try {
            if (!this.validateProduct(product)) {
                throw new Error('Dados do produto inválidos');
            }

            await this.dbService.updateProduct(id, product);
            ui.showFeedback('Produto atualizado com sucesso', 'success');
            return true;
        } catch (error) {
            ui.showFeedback('Erro ao atualizar produto', 'error');
            console.error('Erro ao atualizar produto:', error);
            throw error;
        }
    }

    // Remove um produto
    async deleteProduct(id) {
        try {
            await this.dbService.deleteProduct(id);
            ui.showFeedback('Produto removido com sucesso', 'success');
            return true;
        } catch (error) {
            ui.showFeedback('Erro ao remover produto', 'error');
            console.error('Erro ao remover produto:', error);
            throw error;
        }
    }

    // Busca um produto por ID
    async getProductById(id) {
        try {
            return await this.dbService.getProductById(id);
        } catch (error) {
            ui.showFeedback('Erro ao buscar produto', 'error');
            console.error('Erro ao buscar produto:', error);
            throw error;
        }
    }

    // Filtra produtos
    async filterProducts(searchTerm = '', marca = '') {
        try {
            const products = await this.getProducts();
            return products.filter(product => {
                const matchesSearch = searchTerm === '' || 
                    product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.descricao.toLowerCase().includes(searchTerm.toLowerCase());

                const matchesMarca = marca === '' || product.marca === marca;

                return matchesSearch && matchesMarca;
            });
        } catch (error) {
            console.error('Erro ao filtrar produtos:', error);
            return [];
        }
    }

    // Ordena produtos
    async sortProducts(products, sortBy = '') {
        try {
            const sortedProducts = [...products];
            
            switch(sortBy) {
                case 'preco_asc':
                    sortedProducts.sort((a, b) => parseFloat(a.preco) - parseFloat(b.preco));
                    break;
                case 'preco_desc':
                    sortedProducts.sort((a, b) => parseFloat(b.preco) - parseFloat(a.preco));
                    break;
                case 'nome_asc':
                    sortedProducts.sort((a, b) => a.nome.localeCompare(b.nome));
                    break;
                case 'nome_desc':
                    sortedProducts.sort((a, b) => b.nome.localeCompare(a.nome));
                    break;
            }
            
            return sortedProducts;
        } catch (error) {
            console.error('Erro ao ordenar produtos:', error);
            return products;
        }
    }

    // Validação de produto
    validateProduct(product) {
        return (
            product &&
            typeof product === 'object' &&
            typeof product.nome === 'string' && product.nome.trim() !== '' &&
            typeof product.marca === 'string' && product.marca.trim() !== '' &&
            (typeof product.preco === 'number' || !isNaN(parseFloat(product.preco))) &&
            parseFloat(product.preco) > 0
        );
    }

    // Sanitização de produto
    sanitizeProduct(product) {
        return {
            nome: product.nome.trim(),
            marca: product.marca.trim(),
            descricao: product.descricao ? product.descricao.trim() : '',
            preco: parseFloat(product.preco)
        };
    }

    // Obtém marcas únicas
    async getUniqueBrands() {
        try {
            const products = await this.getProducts();
            return [...new Set(products.map(p => p.marca))].sort();
        } catch (error) {
            console.error('Erro ao obter marcas:', error);
            return [];
        }
    }
}

// Exporta a instância do gerenciador de produtos
export const productManager = new ProductManager();
