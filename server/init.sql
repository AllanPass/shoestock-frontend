-- Drop table if exists
DROP TABLE IF EXISTS produtos_cadastrados;

-- Create table
CREATE TABLE produtos_cadastrados (
    id SERIAL PRIMARY KEY,
    referencia VARCHAR(100) NOT NULL,
    marca VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    category VARCHAR(100) NOT NULL CHECK (category IN ('Masculino', 'Feminino', 'Infantil Masculino', 'Infantil Feminino', 'Baby Masculino', 'Baby Feminino')),
    imagem TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better performance
CREATE INDEX idx_produtos_categoria ON produtos_cadastrados(category);
CREATE INDEX idx_produtos_referencia ON produtos_cadastrados(referencia);

-- Insert sample data
INSERT INTO produtos_cadastrados (referencia, marca, descricao, preco, category)
VALUES 
    ('REF001', 'Nike', 'Tênis Nike Air Max', 599.99, 'Masculino'),
    ('REF002', 'Adidas', 'Tênis Adidas Ultraboost', 699.99, 'Feminino'),
    ('REF003', 'Puma', 'Tênis Puma RS-X', 499.99, 'Infantil Masculino');
