// Dados para geração aleatória
const marcas = [
    'Nike', 'Adidas', 'Puma', 'Reebok', 'New Balance',
    'Asics', 'Vans', 'Converse', 'Under Armour', 'Fila',
    'Mizuno', 'Oakley', 'Skechers', 'Timberland', 'Lacoste'
];

const categorias = [
    'Esporte', 'Casual', 'Social', 'Running', 'Training',
    'Skatista', 'Basketball', 'Futebol', 'Tennis', 'Caminhada'
];

const cores = [
    'Preto', 'Branco', 'Azul', 'Vermelho', 'Cinza',
    'Verde', 'Amarelo', 'Rosa', 'Roxo', 'Marrom'
];

const tamanhos = [
    '34', '35', '36', '37', '38', '39',
    '40', '41', '42', '43', '44', '45'
];

// Verifica se o usuário está autenticado
function verificarAutenticacao() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = '/login.html';
        return false;
    }
    return true;
}

// Função para gerar referência aleatória
function gerarReferencia() {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return 'REF-' + 
           letras.charAt(Math.floor(Math.random() * letras.length)) +
           letras.charAt(Math.floor(Math.random() * letras.length)) +
           String(Math.floor(Math.random() * 10000)).padStart(4, '0');
}

// Função para gerar preço aleatório
function gerarPreco() {
    return Number((Math.random() * 900 + 99.90).toFixed(2));
}

// Função para gerar estoque aleatório
function gerarEstoque() {
    return Math.floor(Math.random() * 100) + 1;
}

// Função para gerar um produto aleatório
function gerarProduto() {
    const marca = marcas[Math.floor(Math.random() * marcas.length)];
    const categoria = categorias[Math.floor(Math.random() * categorias.length)];
    const cor = cores[Math.floor(Math.random() * cores.length)];
    const tamanho = tamanhos[Math.floor(Math.random() * tamanhos.length)];
    
    const descricao = `Calçado ${categoria.toLowerCase()} da marca ${marca} na cor ${cor.toLowerCase()}. ` +
                     `Ideal para ${categoria.toLowerCase() === 'casual' ? 'uso diário' : categoria.toLowerCase()}. ` +
                     `Disponível no tamanho ${tamanho}. Fabricado com materiais de alta qualidade.`;
    
    return {
        referencia: gerarReferencia(),
        marca: marca,
        descricao: descricao,
        categoria: categoria,
        preco: gerarPreco(),
        estoque: gerarEstoque(),
        tamanho: tamanho,
        cor: cor
    };
}

// Função para inserir produtos em lotes
async function inserirLoteProdutos(inicio, quantidade) {
    if (!verificarAutenticacao()) return false;

    const progressBar = document.getElementById('seedProgress');
    const progressText = document.getElementById('progressText');
    
    for(let i = inicio; i < inicio + quantidade && i <= 300; i++) {
        try {
            const produto = gerarProduto();
            const response = await fetch(`${window.config.apiBaseUrl}/api/produtos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(produto)
            });
            
            if (!response.ok) {
                if (response.status === 401) {
                    window.location.href = '/login.html';
                    throw new Error('Sessão expirada. Por favor, faça login novamente.');
                }
                throw new Error(`Erro ao inserir produto ${i}: ${response.statusText}`);
            }
            
            // Atualiza a barra de progresso
            if (progressBar) {
                progressBar.value = (i / 300) * 100;
            }
            if (progressText) {
                progressText.textContent = `Progresso: ${i}/300 produtos`;
            }
            
            // Pequeno delay para não sobrecarregar a API
            await new Promise(resolve => setTimeout(resolve, 100));
            
        } catch (error) {
            console.error(error);
            Toastify({
                text: `Erro ao inserir produto: ${error.message}`,
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "#ef4444"
            }).showToast();
            return false;
        }
    }
    return true;
}

// Função para iniciar o processo
async function iniciarInsercao() {
    if (!verificarAutenticacao()) return;

    if (!confirm('Deseja inserir 300 produtos aleatórios no banco de dados?')) {
        return;
    }
    
    // Cria elementos de progresso se não existirem
    if (!document.getElementById('seedProgress')) {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-50 w-80';
        progressContainer.innerHTML = `
            <div class="mb-2 flex justify-between">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Inserindo produtos...</span>
                <span id="progressText" class="text-sm text-gray-500 dark:text-gray-400">Progresso: 0/300 produtos</span>
            </div>
            <progress id="seedProgress" max="100" value="0" class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div class="bg-blue-600 h-2 rounded-full" style="width: 0%"></div>
            </progress>
        `;
        document.body.appendChild(progressContainer);
    }
    
    document.body.style.cursor = 'wait';
    
    try {
        // Insere produtos em lotes de 10 para melhor performance
        for(let i = 0; i < 300; i += 10) {
            const sucesso = await inserirLoteProdutos(i, 10);
            if (!sucesso) {
                throw new Error('Processo interrompido devido a erros.');
            }
        }
        
        Toastify({
            text: "300 produtos inseridos com sucesso!",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#22c55e"
        }).showToast();
        
        // Recarrega a lista de produtos
        if (window.listingManager) {
            window.listingManager.loadProducts();
        }
        
    } catch (error) {
        console.error('Erro durante a inserção:', error);
        Toastify({
            text: `Erro: ${error.message}`,
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#ef4444"
        }).showToast();
    } finally {
        document.body.style.cursor = 'default';
        // Remove a barra de progresso após 2 segundos
        setTimeout(() => {
            const progressContainer = document.getElementById('seedProgress')?.parentElement;
            if (progressContainer) {
                progressContainer.remove();
            }
        }, 2000);
    }
}

// Adiciona botão na interface se ainda não existir
document.addEventListener('DOMContentLoaded', () => {
    // Verifica autenticação antes de mostrar o botão
    if (!verificarAutenticacao()) return;

    if (!document.getElementById('seedButton')) {
        const button = document.createElement('button');
        button.id = 'seedButton';
        button.textContent = 'Inserir 300 Produtos';
        button.className = 'px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 ml-4';
        button.onclick = iniciarInsercao;
        
        // Adiciona o botão ao lado do botão de cadastro
        const navbar = document.querySelector('.flex.items-center.space-x-4');
        if (navbar) {
            navbar.appendChild(button);
        }
    }
});
