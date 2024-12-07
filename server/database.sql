-- Cria o banco de dados
CREATE DATABASE IF NOT EXISTS shoestock;
\c shoestock

-- Cria a tabela de produtos
CREATE TABLE IF NOT EXISTS produtos_cadastrados (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    size VARCHAR(10) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reference_code VARCHAR(50) UNIQUE
);

-- Função para atualizar o updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar o updated_at
CREATE TRIGGER update_produtos_cadastrados_updated_at
    BEFORE UPDATE ON produtos_cadastrados
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_produtos_name ON produtos_cadastrados(name);
CREATE INDEX IF NOT EXISTS idx_produtos_brand ON produtos_cadastrados(brand);
CREATE INDEX IF NOT EXISTS idx_produtos_category ON produtos_cadastrados(category);
CREATE INDEX IF NOT EXISTS idx_produtos_price ON produtos_cadastrados(price);
CREATE INDEX IF NOT EXISTS idx_produtos_reference ON produtos_cadastrados(reference_code);

-- Inserir alguns dados de exemplo
INSERT INTO produtos_cadastrados (name, description, price, stock, size, brand, category)
VALUES 
    ('Tênis Runner', 'Tênis esportivo para corrida', 299.99, 50, '42', 'Nike', 'Esporte'),
    ('Sapato Social', 'Sapato social em couro', 199.99, 30, '40', 'Social Feet', 'Social'),
    ('Sandália Confort', 'Sandália confortável para o dia a dia', 89.99, 45, '37', 'Comfort Plus', 'Casual')
ON CONFLICT DO NOTHING;
