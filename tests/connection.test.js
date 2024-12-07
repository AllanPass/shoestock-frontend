const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

async function testDatabaseConnection() {
    const prisma = new PrismaClient();
    try {
        // Teste de conexão com o banco
        await prisma.$connect();
        console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');
        
        // Teste básico de query
        const productCount = await prisma.produtosCadastrados.count();
        console.log(`✅ Query teste executada com sucesso. Total de produtos: ${productCount}`);
        
    } catch (error) {
        console.error('❌ Erro na conexão com o banco de dados:', error);
    } finally {
        await prisma.$disconnect();
    }
}

async function testPageRendering() {
    const pages = ['index.html', 'cadastro.html', 'listing.html'];
    const frontendUrl = 'http://localhost:5173';
    const backendUrl = 'http://127.0.0.1:3001';

    console.log('\n🌐 Testando Frontend (Vite)...');
    for (const page of pages) {
        try {
            console.log(`\nTestando ${frontendUrl}/${page}...`);
            const response = await axios.get(`${frontendUrl}/${page}`, {
                headers: {
                    'Accept': 'text/html',
                    'User-Agent': 'TestScript'
                },
                timeout: 5000
            });
            
            if (response.status === 200) {
                console.log(`✅ Página ${page} está sendo renderizada corretamente no Vite`);
                console.log(`   Content-Type: ${response.headers['content-type']}`);
                console.log(`   Tamanho: ${response.data.length} bytes`);
            }
        } catch (error) {
            console.error(`❌ Erro ao acessar ${page} no Vite:`);
            if (error.code === 'ECONNREFUSED') {
                console.error('   Servidor Vite não está respondendo. Verifique se "npm run dev" está rodando.');
            } else if (error.response) {
                console.error(`   Status: ${error.response.status}`);
                console.error(`   Mensagem: ${error.response.statusText}`);
            } else {
                console.error('   Erro:', error.message);
            }
        }
    }

    console.log('\n🔌 Testando Backend (Express)...');
    try {
        const apiResponse = await axios.get(`${backendUrl}/api/produtos`);
        console.log('✅ API está funcionando corretamente');
        console.log(`   Total de produtos: ${apiResponse.data.length}`);
        console.log(`   Primeiro produto: ${JSON.stringify(apiResponse.data[0]?.referencia || 'N/A')}`);
    } catch (error) {
        console.error('❌ Erro ao acessar a API:');
        if (error.code === 'ECONNREFUSED') {
            console.error('   Servidor Express não está respondendo. Verifique se o backend está rodando.');
        } else if (error.response) {
            console.error(`   Status: ${error.response.status}`);
            console.error(`   Mensagem: ${error.response.statusText}`);
        } else {
            console.error('   Erro:', error.message);
        }
    }
}

async function runTests() {
    console.log('🔍 Iniciando testes...\n');
    
    console.log('📊 Testando conexão com o banco de dados...');
    await testDatabaseConnection();
    
    console.log('\n🌐 Testando renderização das páginas...');
    await testPageRendering();
}

runTests();
