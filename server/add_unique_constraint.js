const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'shoestock',
    password: 'postgres',
    port: 5432,
});

async function addUniqueConstraint() {
    try {
        const client = await pool.connect();
        
        // Adicionar restrição UNIQUE na coluna referencia
        await client.query(`
            ALTER TABLE produtos_cadastrados
            ADD CONSTRAINT produtos_cadastrados_referencia_key UNIQUE (referencia);
        `);
        
        console.log('Restrição UNIQUE adicionada com sucesso na coluna referencia');
        client.release();
    } catch (error) {
        console.error('Erro ao adicionar restrição UNIQUE:', error);
    } finally {
        await pool.end();
    }
}

addUniqueConstraint();
