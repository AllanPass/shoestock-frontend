// Constantes
const API_URL = '/api';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB em bytes

// Elementos do DOM
const form = document.getElementById('produto-form');
const referenciaInput = document.getElementById('referencia');
const marcaInput = document.getElementById('marca');
const descricaoInput = document.getElementById('descricao');
const categoriaInput = document.getElementById('categoria');
const precoInput = document.getElementById('preco');
const imagemInput = document.getElementById('imagem');
const imagePreviewContainer = document.getElementById('image-preview-container');
const imagePreview = document.getElementById('image-preview');
const removeImageButton = document.getElementById('remove-image');

// Variáveis globais
let currentImage = null;

// Dashboard de sucesso
const createSuccessDashboard = (productData) => {
    const dashboard = document.createElement('div');
    dashboard.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    dashboard.innerHTML = `
        <div class="bg-secondary p-8 rounded-lg shadow-xl max-w-md w-full mx-4 relative overflow-hidden">
            <!-- Faixa de sucesso verde no topo -->
            <div class="absolute top-0 left-0 right-0 h-2 bg-green-500"></div>
            
            <!-- Ícone de sucesso -->
            <div class="flex justify-center mb-6">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <i data-feather="check" class="w-8 h-8 text-green-500"></i>
                </div>
            </div>

            <!-- Título -->
            <h2 class="text-2xl font-bold text-primary text-center mb-6">Produto Cadastrado!</h2>

            <!-- Detalhes do produto -->
            <div class="space-y-4 mb-6">
                <div class="flex justify-between items-center">
                    <span class="text-primary font-medium">Referência:</span>
                    <span class="text-primary">${productData.referencia}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-primary font-medium">Marca:</span>
                    <span class="text-primary">${productData.marca}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-primary font-medium">Preço:</span>
                    <span class="text-primary">R$ ${formatCurrency(String(productData.preco * 100))}</span>
                </div>
            </div>

            <!-- Botões -->
            <div class="flex space-x-4">
                <button onclick="window.location.href='cadastro.html'" class="flex-1 px-4 py-2 bg-secondary border border-theme text-primary rounded-lg hover:bg-accent-primary hover:text-white transition-colors">
                    Novo Produto
                </button>
                <button onclick="window.location.href='listing.html'" class="flex-1 px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-hover transition-colors">
                    Ver Produtos
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(dashboard);
    feather.replace();

    // Adiciona animação de entrada
    const dashboardContent = dashboard.firstElementChild;
    dashboardContent.style.transform = 'scale(0.9)';
    dashboardContent.style.opacity = '0';
    dashboardContent.style.transition = 'all 0.3s ease-out';

    setTimeout(() => {
        dashboardContent.style.transform = 'scale(1)';
        dashboardContent.style.opacity = '1';
    }, 50);
};

// Funções auxiliares
const formatCurrency = (value) => {
    value = value.replace(/\D/g, '');
    value = (parseInt(value) / 100).toFixed(2);
    value = value.replace('.', ',');
    value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    return value;
};

const unformatCurrency = (value) => {
    return parseFloat(value.replace(/\./g, '').replace(',', '.'));
};

const showError = (inputElement, message) => {
    const feedbackElement = document.getElementById(`${inputElement.id}-feedback`);
    if (feedbackElement) {
        feedbackElement.textContent = message;
        feedbackElement.classList.remove('hidden');
        inputElement.classList.add('border-red-500');
    }
};

const hideError = (inputElement) => {
    const feedbackElement = document.getElementById(`${inputElement.id}-feedback`);
    if (feedbackElement) {
        feedbackElement.classList.add('hidden');
        inputElement.classList.remove('border-red-500');
    }
};

// Validação do formulário
function validateForm() {
    let isValid = true;

    // Validação da referência
    if (!referenciaInput.value.trim()) {
        showError(referenciaInput, 'Referência é obrigatória');
        isValid = false;
    } else {
        hideError(referenciaInput);
    }

    // Validação da marca
    if (!marcaInput.value.trim()) {
        showError(marcaInput, 'Marca é obrigatória');
        isValid = false;
    } else {
        hideError(marcaInput);
    }

    // Validação da categoria
    if (!categoriaInput.value) {
        showError(categoriaInput, 'Selecione uma categoria');
        isValid = false;
    } else {
        hideError(categoriaInput);
    }

    // Validação do preço
    const precoValue = unformatCurrency(precoInput.value);
    if (!precoValue || isNaN(precoValue) || precoValue <= 0) {
        showError(precoInput, 'Preço inválido');
        isValid = false;
    } else {
        hideError(precoInput);
    }

    return isValid;
}

// Event Listeners
precoInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) {
        value = value.slice(0, 8);
    }
    e.target.value = formatCurrency(value);
});

imagemInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        if (file.size > MAX_FILE_SIZE) {
            showError(imagemInput, 'A imagem deve ter no máximo 5MB');
            imagemInput.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            currentImage = e.target.result;
            imagePreview.src = currentImage;
            imagePreviewContainer.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
});

removeImageButton.addEventListener('click', () => {
    currentImage = null;
    imagemInput.value = '';
    imagePreviewContainer.classList.add('hidden');
});

// Submissão do formulário
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    try {
        const formData = {
            referencia: referenciaInput.value.trim(),
            marca: marcaInput.value.trim(),
            descricao: descricaoInput.value.trim(),
            category: categoriaInput.value,  // Usando o valor do select
            preco: parseFloat(unformatCurrency(precoInput.value))
        };

        if (currentImage) {
            formData.imagem = currentImage;
        }

        const response = await fetch(`${API_URL}/produtos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erro ao cadastrar produto');
        }

        const productData = await response.json();
        
        // Mostrar dashboard de sucesso
        createSuccessDashboard(productData);
        
        // Limpar formulário
        form.reset();
        imagePreviewContainer.classList.add('hidden');
        currentImage = null;

    } catch (error) {
        console.error('Erro:', error);
        alert(error.message || 'Erro ao cadastrar produto');
    }
});
