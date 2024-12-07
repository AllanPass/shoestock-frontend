const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'shoestock',
    password: 'postgres',
    port: 5432,
});

async function checkTableStructure() {
    const client = await pool.connect();
    try {
        const query = `
            SELECT column_name, data_type, character_maximum_length
            FROM information_schema.columns
            WHERE table_name = 'produtos_cadastrados'
            ORDER BY ordinal_position;
        `;
        
        const result = await client.query(query);
        console.log('\nEstrutura da tabela produtos_cadastrados:');
        result.rows.forEach(column => {
            console.log(`- ${column.column_name}: ${column.data_type}${column.character_maximum_length ? `(${column.character_maximum_length})` : ''}`);
        });

    } catch (error) {
        console.error('Erro ao verificar estrutura da tabela:', error);
    } finally {
        client.release();
        pool.end();
    }
}

checkTableStructure();
