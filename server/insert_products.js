const prisma = require('./prisma');
const { Decimal } = require('@prisma/client');

const products = [
    {
        name: 'Tênis Air Max',
        description: 'Tênis esportivo com tecnologia de amortecimento',
        price: 599.99,
        stock: 30,
        size: '40',
        brand: 'Nike',
        category: 'Esporte',
        reference_code: 'NK-AM-001'
    },
    {
        name: 'Tênis Ultraboost',
        description: 'Tênis para corrida com tecnologia boost',
        price: 699.99,
        stock: 25,
        size: '42',
        brand: 'Adidas',
        category: 'Esporte',
        reference_code: 'AD-UB-001'
    },
    // ... adicione os outros 48 produtos aqui ...
    {
        name: 'Sapato Mule',
        description: 'Sapato estilo mule feminino',
        price: 199.99,
        stock: 35,
        size: '37',
        brand: 'Arezzo',
        category: 'Feminino',
        reference_code: 'AZ-SM-001'
    }
];

async function insertProducts() {
    try {
        for (const product of products) {
            await prisma.produtos_cadastrados.create({
                data: {
                    ...product,
                    price: new Decimal(product.price)
                }
            });
            console.log(`Produto inserido: ${product.name}`);
        }
        console.log('Todos os produtos foram inseridos com sucesso!');
    } catch (error) {
        console.error('Erro ao inserir produtos:', error);
    } finally {
        await prisma.$disconnect();
    }
}

insertProducts();
