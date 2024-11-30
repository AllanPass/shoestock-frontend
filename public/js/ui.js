// Gerenciamento da interface do usuário
class UI {
    constructor() {
        this.feedbackTimeout = null;
        this.loadingCount = 0;
    }

    // Mostra feedback ao usuário
    showFeedback(message, type = 'info', duration = 5000) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500' :
            type === 'error' ? 'bg-red-500' :
            'bg-blue-500'
        } text-white`;
        
        alertDiv.setAttribute('role', 'alert');
        alertDiv.innerHTML = `
            <div class="flex items-center">
                <i data-feather="${
                    type === 'success' ? 'check-circle' :
                    type === 'error' ? 'alert-circle' :
                    'info'
                }" class="mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(alertDiv);
        feather.replace();

        // Remove feedback anterior se existir
        if (this.feedbackTimeout) {
            clearTimeout(this.feedbackTimeout);
        }

        // Configura remoção automática
        this.feedbackTimeout = setTimeout(() => {
            alertDiv.classList.add('opacity-0', 'transition-opacity');
            setTimeout(() => alertDiv.remove(), 300);
        }, duration);
    }

    // Mostra diálogo de confirmação
    async showConfirmDialog(message) {
        return new Promise((resolve) => {
            const dialog = document.createElement('div');
            dialog.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
            dialog.setAttribute('role', 'dialog');
            dialog.setAttribute('aria-modal', 'true');
            
            dialog.innerHTML = `
                <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm mx-4">
                    <h3 class="text-lg font-semibold text-primary mb-4">Confirmação</h3>
                    <p class="text-secondary mb-6">${message}</p>
                    <div class="flex justify-end space-x-4">
                        <button class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700" data-action="cancel">
                            Cancelar
                        </button>
                        <button class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700" data-action="confirm">
                            Confirmar
                        </button>
                    </div>
                </div>
            `;

            const handleClick = (e) => {
                const action = e.target.getAttribute('data-action');
                if (action) {
                    dialog.remove();
                    resolve(action === 'confirm');
                }
            };

            dialog.addEventListener('click', handleClick);
            document.body.appendChild(dialog);
        });
    }

    // Mostra indicador de carregamento
    showLoading() {
        this.loadingCount++;
        
        if (this.loadingCount === 1) {
            const loader = document.createElement('div');
            loader.id = 'global-loader';
            loader.className = 'fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50';
            loader.setAttribute('role', 'progressbar');
            loader.innerHTML = `
                <div class="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center space-x-3">
                    <div class="animate-spin rounded-full h-6 w-6 border-4 border-accent-primary border-t-transparent"></div>
                    <span class="text-primary">Carregando...</span>
                </div>
            `;
            document.body.appendChild(loader);
        }
    }

    // Esconde indicador de carregamento
    hideLoading() {
        this.loadingCount = Math.max(0, this.loadingCount - 1);
        
        if (this.loadingCount === 0) {
            const loader = document.getElementById('global-loader');
            if (loader) {
                loader.remove();
            }
        }
    }

    // Renderiza lista de produtos
    renderProducts(products, container) {
        if (!container) return;

        if (products.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-8 text-gray-500" role="status">
                    <i data-feather="package" class="mx-auto mb-4 w-12 h-12"></i>
                    <p class="text-lg">Nenhum produto encontrado</p>
                    <a href="cadastro.html" class="text-accent-primary hover:underline">Cadastrar novo produto</a>
                </div>
            `;
            feather.replace();
            return;
        }

        container.innerHTML = products.map((product, index) => `
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-102"
                 role="article"
                 aria-label="Produto: ${product.referencia}">
                <div class="aspect-w-16 aspect-h-9 bg-gray-200">
                    <img src="${product.imagem || 'https://via.placeholder.com/300x200'}" 
                         alt="${product.referencia}" 
                         class="object-cover w-full h-48">
                </div>
                <div class="p-4">
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="text-lg font-semibold text-primary">${product.referencia}</h3>
                        <span class="text-sm font-medium text-accent-primary">${product.marca}</span>
                    </div>
                    <p class="text-secondary mb-4 line-clamp-2">${product.descricao}</p>
                    <div class="flex justify-between items-center">
                        <span class="text-lg font-bold text-accent-primary" aria-label="Preço">
                            R$ ${parseFloat(product.preco).toFixed(2)}
                        </span>
                        <div class="flex space-x-2">
                            <button onclick="editProduct(${index})" 
                                    class="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
                                    aria-label="Editar produto">
                                <i data-feather="edit-2" class="w-5 h-5"></i>
                            </button>
                            <button onclick="deleteProduct(${index})" 
                                    class="p-2 text-red-600 hover:bg-red-100 rounded-full"
                                    aria-label="Excluir produto">
                                <i data-feather="trash-2" class="w-5 h-5"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        feather.replace();
    }

    // Atualiza select de marcas
    updateBrandsSelect(brands, select) {
        if (!select) return;

        select.innerHTML = `
            <option value="">Todas as Marcas</option>
            ${brands.map(marca => `
                <option value="${marca}">${marca}</option>
            `).join('')}
        `;
    }
}

// Exporta a instância da UI
export const ui = new UI();
