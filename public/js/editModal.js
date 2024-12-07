class EditModalManager {
    constructor() {
        this.modal = document.getElementById('editModal');
        this.form = document.getElementById('editForm');
        this.imagePreview = document.getElementById('editImagePreview');
        this.imageInput = document.getElementById('editImageInput');
        this.productId = document.getElementById('editProductId');
        
        // Campos do formulário
        this.referenceInput = document.getElementById('editReference');
        this.brandInput = document.getElementById('editBrand');
        this.descriptionInput = document.getElementById('editDescription');
        this.categoryInput = document.getElementById('editCategory');
        this.priceInput = document.getElementById('editPrice');
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Listener para preview de imagem
        this.imageInput?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.imagePreview.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });

        // Fechar modal quando clicar fora
        this.modal?.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Prevenir propagação do clique dentro do modal
        this.modal?.querySelector('.modal-content')?.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Listener para o formulário
        this.form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.save();
        });
    }

    async open(productId) {
        try {
            const response = await window.produtosService.getProduct(productId);
            
            if (!response.success) {
                throw new Error(response.error || 'Erro ao carregar produto');
            }

            const product = response.data;
            
            this.productId.value = product.id;
            this.referenceInput.value = product.referencia || '';
            this.brandInput.value = product.marca || '';
            this.descriptionInput.value = product.descricao || '';
            this.categoryInput.value = product.categoria || '';
            this.priceInput.value = product.preco || '';
            this.imagePreview.src = product.imagem || window.config.defaultImageUrl;
            
            this.modal.classList.remove('hidden');
            this.modal.classList.add('flex');
            feather.replace();
        } catch (error) {
            console.error('Erro ao abrir modal:', error);
            Toastify({
                text: "Erro ao carregar produto: " + error.message,
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "#ef4444"
            }).showToast();
        }
    }

    close() {
        this.modal.classList.add('hidden');
        this.modal.classList.remove('flex');
        this.form.reset();
        this.imagePreview.src = window.config.defaultImageUrl;
    }

    async save() {
        try {
            const formData = new FormData();
            formData.append('id', this.productId.value);
            formData.append('referencia', this.referenceInput.value);
            formData.append('marca', this.brandInput.value);
            formData.append('descricao', this.descriptionInput.value);
            formData.append('categoria', this.categoryInput.value);
            formData.append('preco', this.priceInput.value);

            if (this.imageInput.files[0]) {
                formData.append('imagem', this.imageInput.files[0]);
            }

            const response = await window.produtosService.updateProduct(this.productId.value, formData);

            if (response.success) {
                Toastify({
                    text: "Produto atualizado com sucesso!",
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    backgroundColor: "#22c55e"
                }).showToast();

                this.close();
                // Recarregar lista de produtos
                window.listingManager.loadProducts();
            } else {
                throw new Error(response.error || 'Erro ao atualizar produto');
            }
        } catch (error) {
            console.error('Erro ao salvar produto:', error);
            Toastify({
                text: "Erro ao atualizar produto: " + error.message,
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "#ef4444"
            }).showToast();
        }
    }
}

// Instância global do gerenciador do modal
window.editModalManager = new EditModalManager();

// Funções globais para o modal
async function openEditModal(productId) {
    await window.editModalManager.open(productId);
}

function closeEditModal() {
    window.editModalManager.close();
}

async function saveProductChanges() {
    await window.editModalManager.save();
}
