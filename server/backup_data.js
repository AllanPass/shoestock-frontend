const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function backupData() {
    try {
        console.log('Iniciando backup dos dados...');
        
        // Busca todos os produtos
        const products = await prisma.produtos_cadastrados.findMany();
        
        // Cria diretório de backup se não existir
        const backupDir = path.join(__dirname, 'backup');
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir);
        }
        
        // Salva os dados em um arquivo JSON
        const backupFile = path.join(backupDir, `backup_${Date.now()}.json`);
        fs.writeFileSync(backupFile, JSON.stringify(products, null, 2));
        
        console.log(`Backup concluído! Arquivo salvo em: ${backupFile}`);
        
        // Extrai marcas e categorias únicas
        const brands = [...new Set(products.map(p => p.brand))];
        const categories = [...new Set(products.map(p => p.category))];
        
        // Salva marcas e categorias separadamente
        fs.writeFileSync(
            path.join(backupDir, 'brands.json'),
            JSON.stringify(brands, null, 2)
        );
        
        fs.writeFileSync(
            path.join(backupDir, 'categories.json'),
            JSON.stringify(categories, null, 2)
        );
        
        console.log('Backup de marcas e categorias concluído!');
        
    } catch (error) {
        console.error('Erro ao fazer backup:', error);
    } finally {
        await prisma.$disconnect();
    }
}

backupData();
