-- Adiciona check constraint para categorias válidas
ALTER TABLE "produtos_cadastrados"
DROP CONSTRAINT IF EXISTS "produtos_cadastrados_category_check";

ALTER TABLE "produtos_cadastrados"
ADD CONSTRAINT "produtos_cadastrados_category_check"
CHECK (category IN ('Casual', 'Esportivo', 'Corrida', 'Skate', 'Social'));
