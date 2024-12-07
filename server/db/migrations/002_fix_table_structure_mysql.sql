USE shoestock;

-- Remove a coluna name e mantém apenas referencia
ALTER TABLE produtos_cadastrados DROP COLUMN IF EXISTS name;
ALTER TABLE produtos_cadastrados DROP COLUMN IF EXISTS reference_code;

-- Adiciona a coluna referencia se não existir
ALTER TABLE produtos_cadastrados ADD COLUMN IF NOT EXISTS referencia VARCHAR(50) NOT NULL UNIQUE;

-- Remove índices antigos
DROP INDEX IF EXISTS idx_produtos_name ON produtos_cadastrados;
DROP INDEX IF EXISTS idx_produtos_reference ON produtos_cadastrados;

-- Cria novo índice para referencia
CREATE INDEX idx_produtos_referencia ON produtos_cadastrados(referencia);

-- Atualiza a estrutura para garantir que todos os campos necessários estejam presentes
ALTER TABLE produtos_cadastrados 
    MODIFY COLUMN description TEXT NOT NULL,
    MODIFY COLUMN price DECIMAL(10,2) NOT NULL,
    MODIFY COLUMN stock INTEGER NOT NULL DEFAULT 0,
    MODIFY COLUMN size VARCHAR(10) NOT NULL,
    MODIFY COLUMN brand VARCHAR(100) NOT NULL,
    MODIFY COLUMN category VARCHAR(50) NOT NULL;

-- Adiciona restrições de validação
ALTER TABLE produtos_cadastrados 
    ADD CONSTRAINT check_price_positive CHECK (price >= 0),
    ADD CONSTRAINT check_stock_positive CHECK (stock >= 0);

-- Atualiza os timestamps para terem valores default
ALTER TABLE produtos_cadastrados 
    MODIFY COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    MODIFY COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
