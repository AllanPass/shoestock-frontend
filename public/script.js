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
    if (!imageInput) return;

    const imagePreview = document.getElementById('image-preview');
    const dropzoneLabel = document.getElementById('dropzone-label');
    const removeButton = document.getElementById('remove-image');
    
    if (!imagePreview || !dropzoneLabel || !removeButton) return;

    const dropZone = imageInput.parentElement;
    if (!dropZone) return;

    // Função para mostrar preview
    const showPreview = (file) => {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = imagePreview.querySelector('img');
            if (!img) return;
            
            img.src = e.target.result;
            dropzoneLabel.classList.add('hidden');
            imagePreview.classList.remove('hidden');
            removeButton.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    };

    // Event listeners para o formulário
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            const formData = new FormData(form);
            const productData = {};
            
            formData.forEach((value, key) => {
                productData[key] = value;
            });

            await productManager.addProduct(productData);
            form.reset();
            ui.showFeedback('Produto cadastrado com sucesso!', 'success');
        } catch (error) {
            ui.showFeedback(error.message, 'error');
        }
    });

    // Event listeners para upload de imagem
    if (imageInput) {
        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            showPreview(file);
        });
    }

    if (removeButton) {
        removeButton.addEventListener('click', () => {
            imageInput.value = '';
            imagePreview.querySelector('img').src = '';
            dropzoneLabel.classList.remove('hidden');
            imagePreview.classList.add('hidden');
            removeButton.classList.add('hidden');
        });
    }

    if (dropZone) {
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('border-accent-primary');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('border-accent-primary');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('border-accent-primary');
            const file = e.dataTransfer.files[0];
            imageInput.files = e.dataTransfer.files;
            showPreview(file);
        });
    }
}

// Inicializa a página de listagem
function initializeListingPage() {
    const productList = document.getElementById('product-list');
    if (!productList) return;

    const searchInput = document.getElementById('search-input');
    const brandFilter = document.getElementById('brand-filter');
    const sortSelect = document.getElementById('sort-select');

    // Carrega os produtos iniciais
    loadProducts();

    // Configura os event listeners
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    if (brandFilter) {
        brandFilter.addEventListener('change', handleFilters);
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', handleFilters);
    }
}

// Inicializa a página inicial
function initializeIndexPage() {
    // Adicione aqui a lógica para a página inicial
}

// Função para carregar produtos
async function loadProducts() {
    try {
        const products = await productManager.getProducts();
        displayProducts(products);
    } catch (error) {
        ui.showFeedback('Erro ao carregar produtos', 'error');
    }
}

// Função para exibir produtos
function displayProducts(products) {
    const productList = document.getElementById('product-list');
    if (!productList) return;

    productList.innerHTML = '';

    if (products.length === 0) {
        productList.innerHTML = `
            <div class="text-center py-8 text-secondary col-span-full">
                <p>Nenhum produto encontrado</p>
            </div>
        `;
        return;
    }

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'bg-secondary rounded-lg shadow-lg overflow-hidden';
        card.innerHTML = `
            <div class="relative">
                <img src="${product.imagem || '/images/no-image.jpg'}" 
                     alt="${product.referencia}" 
                     class="w-full h-48 object-cover">
                <div class="absolute top-2 right-2 flex gap-2">
                    <button onclick="editProduct(${product.id})" 
                            class="p-2 bg-accent-primary text-white rounded-full hover:bg-accent-secondary">
                        <i data-feather="edit-2" class="w-4 h-4"></i>
                    </button>
                    <button onclick="deleteProduct(${product.id})" 
                            class="p-2 bg-red-500 text-white rounded-full hover:bg-red-600">
                        <i data-feather="trash-2" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
            <div class="p-4">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="text-lg font-semibold text-primary">${product.referencia}</h3>
                    <span class="text-sm font-medium text-accent-primary">
                        R$ ${parseFloat(product.preco).toFixed(2)}
                    </span>
                </div>
                <p class="text-secondary mb-2">${product.marca}</p>
                <p class="text-sm text-secondary mb-4">${product.descricao}</p>
                <div class="flex justify-between items-center text-sm">
                    <span class="text-secondary">
                        <i data-feather="box" class="inline w-4 h-4 mr-1"></i>
                        Estoque: ${product.stock || 0}
                    </span>
                    <span class="text-secondary">
                        <i data-feather="tag" class="inline w-4 h-4 mr-1"></i>
                        ${product.category || 'Geral'}
                    </span>
                </div>
                <div class="mt-2 text-sm">
                    <span class="text-secondary">
                        <i data-feather="ruler" class="inline w-4 h-4 mr-1"></i>
                        Tamanho: ${product.size || 'N/A'}
                    </span>
                </div>
            </div>
        `;
        productList.appendChild(card);
    });

    // Reinicializa os ícones do Feather
    feather.replace();
}

// Handlers
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    loadProducts(searchTerm);
}

function handleFilters() {
    loadProducts();
}

// Funções globais para edição e exclusão
window.editProduct = async function(id) {
    try {
        const product = await productManager.getProduct(id);
        if (product) {
            // Implemente a lógica de edição aqui
            ui.showFeedback('Função de edição em desenvolvimento', 'info');
        }
    } catch (error) {
        ui.showFeedback('Erro ao carregar produto', 'error');
    }
};

window.deleteProduct = async function(id) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        try {
            await productManager.deleteProduct(id);
            loadProducts();
            ui.showFeedback('Produto excluído com sucesso', 'success');
        } catch (error) {
            ui.showFeedback('Erro ao excluir produto', 'error');
        }
    }
};
