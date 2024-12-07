const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'shoestock',
    password: 'postgres',
    port: 5432,
});

async function checkProducts() {
    const client = await pool.connect();
    try {
        // Conta total de produtos
        const countResult = await client.query('SELECT COUNT(*) FROM produtos_cadastrados');
        console.log(`\nTotal de produtos: ${countResult.rows[0].count}`);

        // Lista alguns produtos como exemplo
        const sampleResult = await client.query('SELECT referencia, marca, descricao, preco, category FROM produtos_cadastrados LIMIT 5');
        console.log('\nExemplos de produtos:');
        sampleResult.rows.forEach(product => {
            console.log(`- [${product.referencia}] ${product.descricao} (${product.marca}) - R$ ${product.preco} - Categoria: ${product.category}`);
        });

        // Conta produtos por categoria
        const categoryResult = await client.query('SELECT category, COUNT(*) FROM produtos_cadastrados GROUP BY category ORDER BY COUNT(*) DESC');
        console.log('\nProdutos por categoria:');
        categoryResult.rows.forEach(cat => {
            console.log(`- ${cat.category}: ${cat.count} produtos`);
        });

    } catch (error) {
        console.error('Erro ao verificar produtos:', error);
    } finally {
        client.release();
        pool.end();
    }
}

checkProducts();
