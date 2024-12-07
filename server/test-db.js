const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testConnection() {
  try {
    // Tenta uma query simples
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('Conexão com o banco de dados bem sucedida!');
    console.log('Resultado do teste:', result);

    // Tenta listar as tabelas
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('\nTabelas existentes:', tables);

    // Tenta contar os produtos
    const count = await prisma.produtosCadastrados.count();
    console.log('\nNúmero de produtos:', count);

  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
