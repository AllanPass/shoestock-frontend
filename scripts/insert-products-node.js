const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'shoestock',
    port: process.env.DB_PORT || 5432
});

async function insertProducts() {
    try {
        const sqlFile = path.join(__dirname, 'insert-products.sql');
        const sql = fs.readFileSync(sqlFile, 'utf8');
        
        const result = await pool.query(sql);
        console.log('✅ Produtos inseridos com sucesso!');
        console.log(`Total de produtos inseridos: ${result.rowCount}`);
    } catch (error) {
        console.error('❌ Erro ao inserir produtos:', error.message);
    } finally {
        await pool.end();
    }
}

insertProducts();
