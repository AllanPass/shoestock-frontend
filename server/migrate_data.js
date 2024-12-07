const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function migrateData() {
    try {
        console.log('Iniciando migração dos dados...');

        // Carrega dados do backup
        const backupDir = path.join(__dirname, 'backup');
        const backupFiles = fs.readdirSync(backupDir).filter(f => f.startsWith('backup_'));
        const latestBackup = backupFiles.sort().pop();
        const products = JSON.parse(fs.readFileSync(path.join(backupDir, latestBackup)));
        
        // Carrega marcas e categorias
        const brands = JSON.parse(fs.readFileSync(path.join(backupDir, 'brands.json')));
        const categories = JSON.parse(fs.readFileSync(path.join(backupDir, 'categories.json')));

        console.log('Criando marcas...');
        const brandMap = new Map();
        for (const brandName of brands) {
            const brand = await prisma.brand.create({
                data: {
                    name: brandName,
                    description: `Marca: ${brandName}`,
                    active: true
                }
            });
            brandMap.set(brandName, brand.id);
        }

        console.log('Criando categorias...');
        const categoryMap = new Map();
        for (const categoryName of categories) {
            const category = await prisma.category.create({
                data: {
                    name: categoryName,
                    description: `Categoria: ${categoryName}`,
                    active: true
                }
            });
            categoryMap.set(categoryName, category.id);
        }

        console.log('Migrando produtos...');
        for (const oldProduct of products) {
            // Cria o produto
            const product = await prisma.product.create({
                data: {
                    referenceCode: oldProduct.reference_code,
                    name: oldProduct.name,
                    description: oldProduct.description,
                    price: oldProduct.price,
                    size: oldProduct.size,
                    brandId: brandMap.get(oldProduct.brand),
                    categoryId: categoryMap.get(oldProduct.category),
                    status: 'ACTIVE',
                    gender: 'UNISEX',
                    featured: false,
                    createdAt: oldProduct.created_at,
                    updatedAt: oldProduct.updated_at
                }
            });

            // Cria inventário padrão
            await prisma.inventory.create({
                data: {
                    productId: product.id,
                    quantity: 0,
                    minStock: 0
                }
            });
        }

        console.log('Migração concluída com sucesso!');

    } catch (error) {
        console.error('Erro na migração:', error);
    } finally {
        await prisma.$disconnect();
    }
}

migrateData();
