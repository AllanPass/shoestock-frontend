-- CreateTable
CREATE TABLE IF NOT EXISTS "produtos_cadastrados" (
    "id" SERIAL PRIMARY KEY,
    "referencia" VARCHAR(100) NOT NULL,
    "marca" VARCHAR(100) NOT NULL,
    "descricao" TEXT NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "imagem" BYTEA,
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "idx_produtos_categoria" ON "produtos_cadastrados"("category");
CREATE INDEX IF NOT EXISTS "idx_produtos_referencia" ON "produtos_cadastrados"("referencia");
