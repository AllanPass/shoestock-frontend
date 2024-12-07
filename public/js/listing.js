class ProductListing {
    constructor() {
        // Verifica autenticação
        this.checkAuth();

        // Elementos DOM
        this.tableBody = document.getElementById('productTableBody');
        this.searchInput = document.getElementById('searchInput');
        this.sortField = document.getElementById('sortField');
        this.sortOrder = document.getElementById('sortOrder');
        this.categoryFilter = document.getElementById('categoryFilter');
        this.minPriceFilter = document.getElementById('minPrice');
        this.maxPriceFilter = document.getElementById('maxPrice');
        this.applyFiltersBtn = document.getElementById('applyFilters');
        this.prevPageBtn = document.getElementById('prevPage');
        this.nextPageBtn = document.getElementById('nextPage');
        this.paginationContainer = document.getElementById('pagination');
        this.totalItemsElement = document.getElementById('totalItems');
        this.clearFiltersBtn = document.getElementById('clearFilters');

        // Estado
        this.products = [];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.totalItems = 0;
        this.filters = {
            busca: '',
            categoria: '',
            precoMin: '',
            precoMax: '',
            ordenarPor: 'descricao',
            ordem: 'asc'
        };

        // Inicialização
        this.init();
    }

    checkAuth() {
        const token = localStorage.getItem('authToken');
        if (!token) {
            window.location.href = '/login.html';
            throw new Error('Usuário não autenticado');
        }
    }

    async init() {
        this.setupEventListeners();
        await this.loadProducts();
        await this.loadCategories();
    }

    setupEventListeners() {
        // Pesquisa com debounce
        if (this.searchInput) {
            let timeout;
            this.searchInput.addEventListener('input', () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    this.filters.busca = this.searchInput.value;
                    this.currentPage = 1;
                    this.loadProducts();
                }, 300);
            });
        }

        // Filtros e ordenação
        if (this.sortField) {
            this.sortField.addEventListener('change', () => {
                this.filters.ordenarPor = this.sortField.value;
                this.loadProducts();
            });
        }

        if (this.sortOrder) {
            this.sortOrder.addEventListener('change', () => {
                this.filters.ordem = this.sortOrder.value;
                this.loadProducts();
            });
        }

        if (this.categoryFilter) {
            this.categoryFilter.addEventListener('change', () => {
                this.filters.categoria = this.categoryFilter.value;
                this.loadProducts();
            });
        }

        // Botão de aplicar filtros
        if (this.applyFiltersBtn) {
            this.applyFiltersBtn.addEventListener('click', () => {
                this.filters.precoMin = this.minPriceFilter.value;
                this.filters.precoMax = this.maxPriceFilter.value;
                this.currentPage = 1;
                this.loadProducts();
            });
        }

        // Botão de limpar filtros
        if (this.clearFiltersBtn) {
            this.clearFiltersBtn.addEventListener('click', () => {
                this.clearFilters();
            });
        }

        // Paginação
        if (this.prevPageBtn) {
            this.prevPageBtn.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.loadProducts();
                }
            });
        }

        if (this.nextPageBtn) {
            this.nextPageBtn.addEventListener('click', () => {
                const maxPages = Math.ceil(this.totalItems / this.itemsPerPage);
                if (this.currentPage < maxPages) {
                    this.currentPage++;
                    this.loadProducts();
                }
            });
        }

        // Tema escuro
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', () => {
                document.documentElement.classList.toggle('dark');
                localStorage.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
                this.updateThemeIcon();
            });
        }

        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                window.auth.logout();
            });
        }
    }

    clearFilters() {
        // Limpa os campos
        if (this.searchInput) this.searchInput.value = '';
        if (this.categoryFilter) this.categoryFilter.value = '';
        if (this.minPriceFilter) this.minPriceFilter.value = '';
        if (this.maxPriceFilter) this.maxPriceFilter.value = '';
        if (this.sortField) this.sortField.value = 'descricao';
        if (this.sortOrder) this.sortOrder.value = 'asc';

        // Reseta os filtros
        this.filters = {
            busca: '',
            categoria: '',
            precoMin: '',
            precoMax: '',
            ordenarPor: 'descricao',
            ordem: 'asc'
        };

        // Recarrega os produtos
        this.currentPage = 1;
        this.loadProducts();
    }

    async loadCategories() {
        try {
            const response = await window.produtosService.getProducts();
            const categories = [...new Set(response.items.map(product => product.categoria))];
            
            if (this.categoryFilter) {
                // Limpa as opções existentes
                this.categoryFilter.innerHTML = '<option value="">Todas as categorias</option>';
                
                // Adiciona as categorias encontradas
                categories.sort().forEach(category => {
                    const option = document.createElement('option');
                    option.value = category;
                    option.textContent = category;
                    this.categoryFilter.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
        }
    }

    async loadProducts() {
        try {
            const params = {
                page: this.currentPage,
                limit: this.itemsPerPage,
                ...this.filters
            };

            const response = await window.produtosService.getProducts(params);
            
            this.products = response.data.items || [];
            this.totalItems = response.data.total || 0;
            
            this.renderProducts();
            this.updatePagination();
            this.updateTotalItems();
            
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            if (error.message === 'Usuário não autenticado') {
                window.location.href = '/login.html';
                return;
            }
            Toastify({
                text: 'Erro ao carregar produtos: ' + error.message,
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "#ef4444"
            }).showToast();
        }
    }

    renderProducts() {
        if (!this.tableBody) return;

        this.tableBody.innerHTML = '';

        if (!this.products || this.products.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td colspan="7" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Nenhum produto encontrado
                </td>
            `;
            this.tableBody.appendChild(tr);
            return;
        }

        this.products.forEach(product => {
            const tr = document.createElement('tr');
            tr.className = 'bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600';
            
            tr.innerHTML = `
                <td class="px-6 py-4 text-center">
                    <img class="w-16 h-16 rounded object-cover mx-auto" 
                         src="${product.imagem || window.config.defaultImageUrl}" 
                         alt="${product.descricao || 'Imagem do produto'}"
                         onerror="this.src='${window.config.defaultImageUrl}'">
                </td>
                <td class="px-6 py-4 dark:text-white">
                    ${product.referencia || '-'}
                </td>
                <td class="px-6 py-4 dark:text-white">
                    ${product.descricao || '-'}
                </td>
                <td class="px-6 py-4 dark:text-white">
                    ${product.marca || '-'}
                </td>
                <td class="px-6 py-4 dark:text-white">
                    ${product.categoria || '-'}
                </td>
                <td class="px-6 py-4 dark:text-white">
                    R$ ${parseFloat(product.preco || 0).toFixed(2)}
                </td>
                <td class="px-6 py-4 text-center">
                    <button type="button" class="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-3" onclick="openEditModal(${product.id})">
                        <i data-feather="edit-2" class="w-4 h-4 inline-block"></i>
                        Editar
                    </button>
                    <button type="button" class="font-medium text-red-600 dark:text-red-500 hover:underline" onclick="deleteProduct(${product.id})">
                        <i data-feather="trash-2" class="w-4 h-4 inline-block"></i>
                        Excluir
                    </button>
                </td>
            `;
            
            this.tableBody.appendChild(tr);
        });

        // Atualiza os ícones
        feather.replace();
    }

    updatePagination() {
        if (!this.paginationContainer) return;

        const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        
        // Atualiza estado dos botões de navegação
        if (this.prevPageBtn) {
            this.prevPageBtn.disabled = this.currentPage <= 1;
            this.prevPageBtn.classList.toggle('opacity-50', this.currentPage <= 1);
        }
        
        if (this.nextPageBtn) {
            this.nextPageBtn.disabled = this.currentPage >= totalPages;
            this.nextPageBtn.classList.toggle('opacity-50', this.currentPage >= totalPages);
        }

        // Atualiza o texto da paginação
        this.paginationContainer.querySelector('.current-page').textContent = this.currentPage;
        this.paginationContainer.querySelector('.total-pages').textContent = totalPages;
    }

    updateTotalItems() {
        if (this.totalItemsElement) {
            this.totalItemsElement.textContent = this.totalItems;
        }
    }

    updateThemeIcon() {
        const darkModeIcon = document.getElementById('darkModeIcon');
        if (darkModeIcon) {
            darkModeIcon.setAttribute('data-feather', 
                document.documentElement.classList.contains('dark') ? 'sun' : 'moon'
            );
            feather.replace();
        }
    }
}

async function deleteProduct(id) {
    try {
        if (!confirm('Tem certeza que deseja excluir este produto?')) {
            return;
        }

        const response = await window.produtosService.deleteProduct(id);
        
        if (response.success) {
            Toastify({
                text: "Produto excluído com sucesso!",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "#22c55e"
            }).showToast();
            
            // Recarrega a lista de produtos
            window.listingManager.loadProducts();
        } else {
            throw new Error(response.error || 'Erro ao excluir produto');
        }
    } catch (error) {
        console.error('Erro ao excluir produto:', error);
        if (error.message === 'Usuário não autenticado') {
            window.location.href = '/login.html';
            return;
        }
        Toastify({
            text: "Erro ao excluir produto: " + error.message,
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#ef4444"
        }).showToast();
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    window.listingManager = new ProductListing();
});
