const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    log: ['error', 'warn'],
    errorFormat: 'pretty',
});

// Funções auxiliares
const bufferToBase64 = (buffer) => {
    if (!buffer) return null;
    try {
        const base64 = buffer.toString('base64');
        return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
        console.error('Erro ao converter buffer para base64:', error);
        return null;
    }
};

const base64ToBuffer = (base64String) => {
    if (!base64String) return null;
    const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
        return Buffer.from(matches[2], 'base64');
    }
    return Buffer.from(base64String, 'base64');
};

// Middleware de validação
const validateProduct = (req, res, next) => {
    const { referencia, marca, descricao, preco, category } = req.body;
    
    const errors = [];
    
    if (!referencia) errors.push('Referência é obrigatória');
    if (!marca) errors.push('Marca é obrigatória');
    if (!descricao) errors.push('Descrição é obrigatória');
    if (!category) errors.push('Categoria é obrigatória');
    
    if (!preco) {
        errors.push('Preço é obrigatório');
    } else if (isNaN(preco) || parseFloat(preco) < 0) {
        errors.push('Preço deve ser um número positivo');
    }

    if (errors.length > 0) {
        return res.status(400).json({ 
            error: 'Dados inválidos',
            details: errors
        });
    }

    next();
};

// Rotas

// GET - Listar todos os produtos com filtros e ordenação
router.get('/', async (req, res) => {
    try {
        console.log('Recebendo requisição GET /api/produtos');
        const { 
            categoria,
            marca,
            precoMin,
            precoMax,
            ordem = 'desc',
            ordenarPor = 'id',
            busca
        } = req.query;

        // Construir where clause
        const where = {};
        
        if (categoria) {
            where.category = categoria;
        }
        
        if (marca) {
            where.marca = marca;
        }
        
        if (precoMin || precoMax) {
            where.preco = {};
            if (precoMin) where.preco.gte = parseFloat(precoMin);
            if (precoMax) where.preco.lte = parseFloat(precoMax);
        }

        if (busca) {
            where.OR = [
                { referencia: { contains: busca, mode: 'insensitive' } },
                { marca: { contains: busca, mode: 'insensitive' } },
                { descricao: { contains: busca, mode: 'insensitive' } },
                { category: { contains: busca, mode: 'insensitive' } }
            ];
        }

        console.log('Buscando produtos com filtros:', where);

        const produtos = await prisma.produtosCadastrados.findMany({
            where,
            orderBy: {
                [ordenarPor]: ordem.toLowerCase()
            }
        });

        console.log(`Encontrados ${produtos.length} produtos`);

        // Converter imagens de Buffer para Base64
        const produtosFormatados = produtos.map(produto => ({
            ...produto,
            imagem: produto.imagem ? bufferToBase64(produto.imagem) : null
        }));

        res.json(produtosFormatados);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).json({ 
            error: 'Erro interno do servidor',
            details: error.message
        });
    }
});

// GET - Buscar produto por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const produto = await prisma.produtosCadastrados.findUniqueOrThrow({
            where: { id: parseInt(id) }
        });
        
        res.json({
            ...produto,
            imagem: produto.imagem ? bufferToBase64(produto.imagem) : null,
            preco: parseFloat(produto.preco)
        });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        res.status(500).json({ error: 'Erro ao buscar produto' });
    }
});

// POST - Criar novo produto
router.post('/', validateProduct, async (req, res) => {
    try {
        const { referencia, marca, descricao, preco, category, imagem } = req.body;
        
        const produto = await prisma.produtosCadastrados.create({
            data: {
                referencia,
                marca,
                descricao,
                preco: parseFloat(preco),
                category,
                imagem: base64ToBuffer(imagem)
            }
        });

        res.status(201).json({
            ...produto,
            imagem: produto.imagem ? bufferToBase64(produto.imagem) : null,
            preco: parseFloat(produto.preco)
        });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ 
                error: 'Produto já existe',
                details: 'Já existe um produto com esta referência'
            });
        }
        res.status(500).json({ error: 'Erro ao criar produto' });
    }
});

// PUT - Atualizar produto
router.put('/:id', validateProduct, async (req, res) => {
    try {
        const { id } = req.params;
        const { referencia, marca, descricao, preco, category, imagem } = req.body;
        
        const produto = await prisma.produtosCadastrados.update({
            where: { id: parseInt(id) },
            data: {
                referencia,
                marca,
                descricao,
                preco: parseFloat(preco),
                category,
                imagem: base64ToBuffer(imagem)
            }
        });

        res.json({
            ...produto,
            imagem: produto.imagem ? bufferToBase64(produto.imagem) : null,
            preco: parseFloat(produto.preco)
        });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
});

// DELETE - Remover produto
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.produtosCadastrados.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).send();
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        res.status(500).json({ error: 'Erro ao remover produto' });
    }
});

module.exports = router;
