const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const produtos = [
    {
        referencia: 'TNK-001',
        marca: 'Nike',
        descricao: 'Tênis Nike Air Max 2023 - Edição Especial',
        category: 'Masculino',
        preco: 599.99,
        imagem: null
    },
    {
        referencia: 'TAD-002',
        marca: 'Adidas',
        descricao: 'Tênis Adidas Ultraboost - Performance',
        category: 'Masculino',
        preco: 499.99,
        imagem: null
    },
    {
        referencia: 'TPM-003',
        marca: 'Puma',
        descricao: 'Tênis Puma RS-X - Casual Feminino',
        category: 'Feminino',
        preco: 399.99,
        imagem: null
    },
    {
        referencia: 'TRB-004',
        marca: 'Reebok',
        descricao: 'Tênis Reebok Classic Kids - Retrô',
        category: 'Infantil Masculino',
        preco: 299.99,
        imagem: null
    },
    {
        referencia: 'TVS-005',
        marca: 'Vans',
        descricao: 'Tênis Vans Old Skool Baby - Skate',
        category: 'Baby Masculino',
        preco: 349.99,
        imagem: null
    }
];

async function seed() {
    try {
        console.log('Iniciando seed do banco de dados...');

        // Limpa os dados existentes
        await prisma.produtosCadastrados.deleteMany();
        console.log('Dados existentes removidos');

        // Insere os novos produtos
        for (const produto of produtos) {
            const created = await prisma.produtosCadastrados.create({
                data: produto
            });
            console.log(`Produto ${produto.referencia} inserido com sucesso:`, created);
        }

        console.log('Seed concluído com sucesso!');
    } catch (error) {
        console.error('Erro durante o seed:', error);
        if (error.code === 'P2003') {
            console.error('Erro de constraint - categoria inválida');
        }
    } finally {
        await prisma.$disconnect();
    }
}

seed();
