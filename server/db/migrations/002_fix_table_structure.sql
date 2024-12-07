-- Remove a coluna name e mantém apenas referencia
ALTER TABLE produtos_cadastrados DROP COLUMN IF EXISTS name;
ALTER TABLE produtos_cadastrados DROP COLUMN IF EXISTS reference_code;

-- Adiciona a coluna referencia se não existir
ALTER TABLE produtos_cadastrados ADD COLUMN IF NOT EXISTS referencia VARCHAR(50) NOT NULL UNIQUE;

-- Remove índices antigos
DROP INDEX IF EXISTS idx_produtos_name;
DROP INDEX IF EXISTS idx_produtos_reference;

-- Cria novo índice para referencia
CREATE INDEX IF NOT EXISTS idx_produtos_referencia ON produtos_cadastrados(referencia);

-- Atualiza a estrutura para garantir que todos os campos necessários estejam presentes
ALTER TABLE produtos_cadastrados 
    ALTER COLUMN description SET NOT NULL,
    ALTER COLUMN price SET NOT NULL,
    ALTER COLUMN stock SET NOT NULL,
    ALTER COLUMN size SET NOT NULL,
    ALTER COLUMN brand SET NOT NULL,
    ALTER COLUMN category SET NOT NULL;

-- Adiciona restrições de validação
ALTER TABLE produtos_cadastrados 
    ADD CONSTRAINT check_price_positive CHECK (price >= 0),
    ADD CONSTRAINT check_stock_positive CHECK (stock >= 0),
    ADD CONSTRAINT check_referencia_format CHECK (referencia ~ '^[A-Za-z0-9\-_]+$');

-- Atualiza os timestamps para terem valores default
ALTER TABLE produtos_cadastrados 
    ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP,
    ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;
