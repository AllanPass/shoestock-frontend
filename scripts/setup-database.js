const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Primeiro, conecta ao postgres para criar o banco de dados
const pgPool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: 'postgres',
    port: process.env.DB_PORT || 5432
});

async function setupDatabase() {
    try {
        // Criar banco de dados
        await pgPool.query(`
            CREATE DATABASE shoestock
            WITH 
            OWNER = postgres
            ENCODING = 'UTF8'
            CONNECTION LIMIT = -1;
        `);
        console.log('✅ Banco de dados criado com sucesso!');
    } catch (error) {
        if (error.code === '42P04') {
            console.log('ℹ️ Banco de dados já existe');
        } else {
            console.error('❌ Erro ao criar banco de dados:', error.message);
            return;
        }
    } finally {
        await pgPool.end();
    }

    // Conecta ao banco shoestock para criar a tabela e inserir os dados
    const shoestockPool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: 'shoestock',
        port: process.env.DB_PORT || 5432
    });

    try {
        // Criar tabela produtos
        await shoestockPool.query(`
            CREATE TABLE IF NOT EXISTS produtos (
                id SERIAL PRIMARY KEY,
                referencia VARCHAR(255) NOT NULL,
                marca VARCHAR(255) NOT NULL,
                category VARCHAR(255) NOT NULL,
                descricao TEXT,
                preco DECIMAL(10,2) NOT NULL,
                imagem TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Tabela produtos criada com sucesso!');

        // Inserir produtos
        const sqlFile = path.join(__dirname, 'insert-products.sql');
        const sql = fs.readFileSync(sqlFile, 'utf8');
        
        const result = await shoestockPool.query(sql);
        console.log('✅ Produtos inseridos com sucesso!');
        console.log(`Total de produtos inseridos: ${result.rowCount}`);
    } catch (error) {
        console.error('❌ Erro ao configurar banco de dados:', error.message);
    } finally {
        await shoestockPool.end();
    }
}

setupDatabase();
