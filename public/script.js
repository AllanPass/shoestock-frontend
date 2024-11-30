// Importa os módulos
import { productManager } from './js/products.js';
import { ui } from './js/ui.js';

document.addEventListener('DOMContentLoaded', async function() {
    feather.replace();

    // Inicializa a página atual
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch(currentPage) {
        case 'cadastro.html':
            initializeCadastroPage();
            break;
        case 'listing.html':
            initializeListingPage();
            break;
        case 'index.html':
            initializeIndexPage();
            break;
    }
});

// Inicializa a página de cadastro
function initializeCadastroPage() {
    const form = document.getElementById('productForm');
    if (!form) return;

    // Setup do upload de imagem
    const imageInput = document.getElementById('imagem');
    const imagePreview = document.getElementById('image-preview');
    const dropzoneLabel = document.getElementById('dropzone-label');
    const removeButton = document.getElementById('remove-image');
    const dropZone = imageInput.parentElement;

    // Função para mostrar preview
    const showPreview = (file) => {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = imagePreview.querySelector('img');
            img.src = e.target.result;
            dropzoneLabel.classList.add('hidden');
            imagePreview.classList.remove('hidden');
            removeButton.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    };

    // Função para remover imagem
    const removeImage = () => {
        imageInput.value = '';
        dropzoneLabel.classList.remove('hidden');
        imagePreview.classList.add('hidden');
        removeButton.classList.add('hidden');
        const img = imagePreview.querySelector('img');
        img.src = '';
    };

    // Event listeners para drag and drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('border-accent-primary');
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.classList.remove('border-accent-primary');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('border-accent-primary');
        
        if (e.dataTransfer.files.length) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                imageInput.files = e.dataTransfer.files;
                showPreview(file);
            } else {
                ui.showFeedback('Por favor, selecione apenas imagens.', 'error');
            }
        }
    });

    // Event listener para seleção de arquivo
    imageInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) {
                ui.showFeedback('A imagem deve ter no máximo 5MB.', 'error');
                removeImage();
                return;
            }
            showPreview(file);
        }
    });

    // Event listener para remover imagem
    removeButton.addEventListener('click', removeImage);

    // Event listener para o formulário
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        ui.showLoading();

        try {
            const product = {
                referencia: document.getElementById('referencia').value,
                marca: document.getElementById('marca').value,
                descricao: document.getElementById('descricao').value,
                preco: document.getElementById('preco').value
            };

            // Processa a imagem
            if (imageInput.files && imageInput.files[0]) {
                const imageData = await processImage(imageInput.files[0]);
                product.imagem = imageData;
            }

            // Adiciona o produto
            await productManager.addProduct(product);
            
            ui.showFeedback('Produto cadastrado com sucesso!', 'success');
            form.reset();
            removeImage();
        } catch (error) {
            ui.showFeedback(error.message, 'error');
        } finally {
            ui.hideLoading();
        }
    });
}

// Inicializa a página de listagem
function initializeListingPage() {
    const productList = document.getElementById('productList');
    if (!productList) return;

    // Renderiza produtos iniciais
    const products = productManager.getProducts();
    ui.renderProducts(products, productList);

    // Setup da pesquisa
    const searchInput = document.querySelector('input[type="text"][placeholder="Pesquisar produtos..."]');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Setup do filtro de marca
    const marcaSelect = document.querySelector('select:first-of-type');
    if (marcaSelect) {
        const marcas = productManager.getUniqueBrands();
        ui.updateBrandsSelect(marcas, marcaSelect);
        marcaSelect.addEventListener('change', handleFilters);
    }

    // Setup da ordenação
    const sortSelect = document.querySelector('select:last-of-type');
    if (sortSelect) {
        sortSelect.addEventListener('change', handleFilters);
    }

    // Setup do formulário de edição
    const editForm = document.getElementById('editForm');
    if (editForm) {
        editForm.addEventListener('submit', handleEditSubmit);
    }
}

// Inicializa a página inicial
function initializeIndexPage() {
    // Implementar funcionalidades específicas da página inicial
}

// Handlers
async function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const marcaSelect = document.querySelector('select:first-of-type');
    const marca = marcaSelect ? marcaSelect.value : '';
    
    const filteredProducts = productManager.filterProducts(searchTerm, marca);
    ui.renderProducts(filteredProducts, document.getElementById('productList'));
}

async function handleFilters() {
    const searchInput = document.querySelector('input[type="text"][placeholder="Pesquisar produtos..."]');
    const marcaSelect = document.querySelector('select:first-of-type');
    const sortSelect = document.querySelector('select:last-of-type');
    
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const marca = marcaSelect ? marcaSelect.value : '';
    const sortBy = sortSelect ? sortSelect.value : '';
    
    let products = productManager.filterProducts(searchTerm, marca);
    products = productManager.sortProducts(products, sortBy);
    
    ui.renderProducts(products, document.getElementById('productList'));
}

async function handleEditSubmit(e) {
    e.preventDefault();
    ui.showLoading();

    try {
        const index = document.getElementById('editId').value;
        const currentProducts = productManager.getProducts();
        const editedProduct = {
            referencia: document.getElementById('editReferencia').value,
            marca: document.getElementById('editMarca').value,
            descricao: document.getElementById('editDescricao').value,
            preco: document.getElementById('editPreco').value,
            imagem: currentProducts[index].imagem // Mantém a imagem atual por padrão
        };

        // Processa nova imagem se fornecida
        const imageInput = document.getElementById('editImagem');
        const removeButton = document.getElementById('edit-remove-image');
        
        if (removeButton.classList.contains('hidden')) {
            // Se o botão de remover está oculto e não há nova imagem, mantém a imagem atual
        } else if (imageInput.files && imageInput.files[0]) {
            // Se uma nova imagem foi selecionada
            editedProduct.imagem = await processImage(imageInput.files[0]);
        } else {
            // Se o botão de remover está visível mas não há nova imagem, significa que a imagem foi removida
            editedProduct.imagem = '';
        }

        await productManager.updateProduct(index, editedProduct);
        closeEditModal();
        ui.showFeedback('Produto atualizado com sucesso!', 'success');
        
        // Atualiza a listagem
        handleFilters();
    } catch (error) {
        ui.showFeedback(error.message, 'error');
    } finally {
        ui.hideLoading();
    }
}

// Funções auxiliares
async function processImage(file) {
    return new Promise((resolve, reject) => {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            reject(new Error('Imagem muito grande. Limite de 5MB.'));
            return;
        }

        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = () => reject(new Error('Erro ao processar imagem'));
        reader.readAsDataURL(file);
    });
}

// Funções expostas globalmente
window.openEditModal = async function(index) {
    const product = productManager.getProducts()[index];
    
    document.getElementById('editId').value = index;
    document.getElementById('editReferencia').value = product.referencia;
    document.getElementById('editMarca').value = product.marca;
    document.getElementById('editDescricao').value = product.descricao;
    document.getElementById('editPreco').value = product.preco;

    // Setup da preview de imagem
    const imagePreview = document.getElementById('edit-image-preview');
    const dropzoneLabel = document.getElementById('edit-dropzone-label');
    const img = imagePreview.querySelector('img');
    
    if (product.imagem) {
        img.src = product.imagem;
        dropzoneLabel.classList.add('hidden');
        imagePreview.classList.remove('hidden');
    } else {
        dropzoneLabel.classList.remove('hidden');
        imagePreview.classList.add('hidden');
    }
    
    document.getElementById('editModal').classList.remove('hidden');
    setupEditImageHandlers();
}

function setupEditImageHandlers() {
    const imageInput = document.getElementById('editImagem');
    const imagePreview = document.getElementById('edit-image-preview');
    const dropzoneLabel = document.getElementById('edit-dropzone-label');
    const removeButton = document.getElementById('edit-remove-image');
    const dropZone = imageInput.parentElement;

    // Função para mostrar preview
    const showPreview = (file) => {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = imagePreview.querySelector('img');
            img.src = e.target.result;
            dropzoneLabel.classList.add('hidden');
            imagePreview.classList.remove('hidden');
            removeButton.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    };

    // Função para remover imagem
    const removeImage = () => {
        imageInput.value = '';
        dropzoneLabel.classList.remove('hidden');
        imagePreview.classList.add('hidden');
        removeButton.classList.add('hidden');
        const img = imagePreview.querySelector('img');
        img.src = '';
    };

    // Event listeners para drag and drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('border-accent-primary');
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.classList.remove('border-accent-primary');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('border-accent-primary');
        
        if (e.dataTransfer.files.length) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                imageInput.files = e.dataTransfer.files;
                showPreview(file);
            } else {
                ui.showFeedback('Por favor, selecione apenas imagens.', 'error');
            }
        }
    });

    // Event listener para seleção de arquivo
    imageInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) {
                ui.showFeedback('A imagem deve ter no máximo 5MB.', 'error');
                removeImage();
                return;
            }
            showPreview(file);
        }
    });

    // Event listener para remover imagem
    removeButton.addEventListener('click', removeImage);
}

window.closeEditModal = function() {
    document.getElementById('editModal').classList.add('hidden');
}

window.deleteProduct = async function(index) {
    const confirmed = await ui.showConfirmDialog('Tem certeza que deseja excluir este produto?');
    if (!confirmed) return;

    ui.showLoading();
    try {
        await productManager.deleteProduct(index);
        ui.showFeedback('Produto excluído com sucesso!', 'success');
        handleFilters();
    } catch (error) {
        ui.showFeedback(error.message, 'error');
    } finally {
        ui.hideLoading();
    }
}
