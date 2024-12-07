const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCategories() {
    try {
        // Tenta buscar todas as categorias distintas
        const categories = await prisma.$queryRaw`
            SELECT DISTINCT category FROM produtos_cadastrados;
        `;
        
        console.log('Categorias existentes:', categories);

        // Tenta buscar a constraint
        const constraints = await prisma.$queryRaw`
            SELECT con.conname, pg_get_constraintdef(con.oid)
            FROM pg_catalog.pg_constraint con
            INNER JOIN pg_catalog.pg_class rel ON rel.oid = con.conrelid
            INNER JOIN pg_catalog.pg_namespace nsp ON nsp.oid = connamespace
            WHERE rel.relname = 'produtos_cadastrados'
            AND con.contype = 'c';
        `;
        
        console.log('Constraints:', constraints);
    } catch (error) {
        console.error('Erro:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkCategories();
