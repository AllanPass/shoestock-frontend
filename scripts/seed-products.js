const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const marcas = [
    'Nike', 'Adidas', 'Puma', 'Reebok', 'New Balance',
    'Asics', 'Vans', 'Converse', 'Fila', 'Under Armour'
];

const categorias = ['Tênis', 'Sapato', 'Chinelo', 'Sandália', 'Bota'];

const descricoes = [
    'Ideal para corrida e caminhada',
    'Perfeito para o dia a dia',
    'Confortável e estiloso',
    'Ótimo para práticas esportivas',
    'Design moderno e atual',
    'Excelente durabilidade',
    'Material de alta qualidade',
    'Tecnologia avançada de amortecimento',
    'Respirável e leve',
    'Versátil para diversas ocasiões'
];

function gerarReferencia() {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numeros = '0123456789';
    let ref = '';
    
    // Gera 3 letras aleatórias
    for (let i = 0; i < 3; i++) {
        ref += letras.charAt(Math.floor(Math.random() * letras.length));
    }
    
    ref += '-';
    
    // Gera 4 números aleatórios
    for (let i = 0; i < 4; i++) {
        ref += numeros.charAt(Math.floor(Math.random() * numeros.length));
    }
    
    return ref;
}

function gerarPreco() {
    // Gera um preço entre 99.90 e 599.90
    return (Math.random() * 500 + 99.90).toFixed(2);
}

async function criarProdutos() {
    try {
        const produtos = [];

        for (let i = 0; i < 50; i++) {
            const produto = {
                referencia: gerarReferencia(),
                marca: marcas[Math.floor(Math.random() * marcas.length)],
                category: categorias[Math.floor(Math.random() * categorias.length)],
                descricao: descricoes[Math.floor(Math.random() * descricoes.length)],
                preco: parseFloat(gerarPreco()),
                imagem: null // Deixando nulo por enquanto
            };
            produtos.push(produto);
        }

        // Inserir produtos em lote
        const result = await prisma.produto.createMany({
            data: produtos,
            skipDuplicates: true
        });

        console.log(`✅ ${result.count} produtos inseridos com sucesso!`);
    } catch (error) {
        console.error('❌ Erro ao inserir produtos:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Executar a função
criarProdutos();
