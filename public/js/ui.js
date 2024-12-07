// Classe para gerenciar a interface do usuário
class UI {
    constructor() {
        this.feedbackTimeout = null;
    }

    // Mostra mensagem de feedback
    showFeedback(message, type = 'info') {
        // Remove feedback anterior se existir
        this.removeFeedback();

        // Cria o elemento de feedback
        const feedback = document.createElement('div');
        feedback.id = 'feedback';
        feedback.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500' :
            type === 'error' ? 'bg-red-500' :
            'bg-blue-500'
        } text-white`;

        feedback.innerHTML = `
            <div class="flex items-center">
                <span class="mr-2">
                    ${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}
                </span>
                <p>${message}</p>
            </div>
        `;

        // Adiciona ao body
        document.body.appendChild(feedback);

        // Remove após 3 segundos
        this.feedbackTimeout = setTimeout(() => {
            this.removeFeedback();
        }, 3000);
    }

    // Remove mensagem de feedback
    removeFeedback() {
        const feedback = document.getElementById('feedback');
        if (feedback) {
            feedback.remove();
        }
        if (this.feedbackTimeout) {
            clearTimeout(this.feedbackTimeout);
        }
    }

    // Mostra loading
    showLoading() {
        const loading = document.createElement('div');
        loading.id = 'loading';
        loading.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        loading.innerHTML = `
            <div class="bg-white p-4 rounded-lg">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
            </div>
        `;
        document.body.appendChild(loading);
    }

    // Remove loading
    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.remove();
        }
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
                    <div class="flex justify-between items-center mb-4">
                        <span class="text-lg font-bold text-accent-primary" aria-label="Preço">
                            R$ ${parseFloat(product.preco).toFixed(2)}
                        </span>
                        <span class="text-sm text-secondary">${product.category}</span>
                    </div>
                    <div class="text-xs text-secondary space-y-1">
                        <p>Cadastrado em: ${new Date(product.createdAt).toLocaleDateString('pt-BR')}</p>
                        <p>Última atualização: ${new Date(product.updatedAt).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div class="flex justify-end space-x-2 mt-4">
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

// Exporta uma instância da classe UI
export const ui = new UI();
