// Gerenciamento de produtos
class ProductManager {
    constructor() {
        this.storageKey = 'products';
    }

    // Obtém todos os produtos
    getProducts() {
        try {
            const products = localStorage.getItem(this.storageKey);
            return products ? JSON.parse(products) : [];
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            return [];
        }
    }

    // Adiciona um novo produto
    addProduct(product) {
        try {
            const products = this.getProducts();
            
            // Validação básica
            if (!this.validateProduct(product)) {
                throw new Error('Dados do produto inválidos');
            }

            // Sanitização dos dados
            product = this.sanitizeProduct(product);

            products.push(product);
            localStorage.setItem(this.storageKey, JSON.stringify(products));
            return true;
        } catch (error) {
            console.error('Erro ao adicionar produto:', error);
            throw error;
        }
    }

    // Atualiza um produto existente
    updateProduct(index, product) {
        try {
            const products = this.getProducts();
            
            if (index < 0 || index >= products.length) {
                throw new Error('Índice de produto inválido');
            }

            if (!this.validateProduct(product)) {
                throw new Error('Dados do produto inválidos');
            }

            product = this.sanitizeProduct(product);
            products[index] = product;
            
            localStorage.setItem(this.storageKey, JSON.stringify(products));
            return true;
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
            throw error;
        }
    }

    // Remove um produto
    deleteProduct(index) {
        try {
            const products = this.getProducts();
            
            if (index < 0 || index >= products.length) {
                throw new Error('Índice de produto inválido');
            }

            products.splice(index, 1);
            localStorage.setItem(this.storageKey, JSON.stringify(products));
            return true;
        } catch (error) {
            console.error('Erro ao excluir produto:', error);
            throw error;
        }
    }

    // Filtra produtos
    filterProducts(searchTerm = '', marca = '') {
        try {
            const products = this.getProducts();
            return products.filter(product => {
                const matchesSearch = searchTerm === '' || 
                    product.referencia.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    sortProducts(products, sortBy = '') {
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
                    sortedProducts.sort((a, b) => a.referencia.localeCompare(b.referencia));
                    break;
                case 'nome_desc':
                    sortedProducts.sort((a, b) => b.referencia.localeCompare(a.referencia));
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
            typeof product.referencia === 'string' && product.referencia.trim() !== '' &&
            typeof product.marca === 'string' && product.marca.trim() !== '' &&
            typeof product.descricao === 'string' && product.descricao.trim() !== '' &&
            !isNaN(parseFloat(product.preco)) && parseFloat(product.preco) >= 0
        );
    }

    // Sanitização de produto
    sanitizeProduct(product) {
        return {
            referencia: this.sanitizeString(product.referencia),
            marca: this.sanitizeString(product.marca),
            descricao: this.sanitizeString(product.descricao),
            preco: parseFloat(product.preco),
            imagem: product.imagem || ''
        };
    }

    // Sanitização de string
    sanitizeString(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Obtém marcas únicas
    getUniqueBrands() {
        try {
            const products = this.getProducts();
            return [...new Set(products.map(p => p.marca))].sort();
        } catch (error) {
            console.error('Erro ao obter marcas:', error);
            return [];
        }
    }
}

// Exporta a instância do gerenciador de produtos
export const productManager = new ProductManager();
