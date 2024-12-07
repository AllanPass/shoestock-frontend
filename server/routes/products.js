const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// GET /api/produtos - Lista todos os produtos
router.get('/', async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                status: 'ACTIVE',
                deletedAt: null
            },
            include: {
                brand: true,
                category: true,
                images: {
                    orderBy: {
                        order: 'asc'
                    }
                },
                inventory: true
            }
        });

        // Formata os dados para manter compatibilidade com o frontend
        const formattedProducts = products.map(p => ({
            id: p.id,
            referencia: p.referenceCode,
            name: p.name,
            descricao: p.description,
            preco: p.price,
            size: p.size,
            marca: p.brand.name,
            category: p.category.name,
            color: p.color,
            material: p.material,
            gender: p.gender,
            featured: p.featured,
            quantity: p.inventory?.quantity || 0,
            images: p.images.map(img => img.url),
            created_at: p.createdAt,
            updated_at: p.updatedAt
        }));

        res.json(formattedProducts);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// POST /api/produtos - Cria um novo produto
router.post('/', async (req, res) => {
    try {
        const {
            referencia,
            name,
            descricao,
            preco,
            size,
            marca,
            category,
            color,
            material,
            gender,
            featured,
            images
        } = req.body;

        // Busca ou cria a marca
        const brand = await prisma.brand.upsert({
            where: { name: marca },
            update: {},
            create: {
                name: marca,
                active: true
            }
        });

        // Busca ou cria a categoria
        const categoryRecord = await prisma.category.upsert({
            where: { name: category },
            update: {},
            create: {
                name: category,
                active: true
            }
        });

        // Cria o produto
        const product = await prisma.product.create({
            data: {
                referenceCode: referencia,
                name,
                description: descricao,
                price: preco,
                size,
                color,
                material,
                gender: gender || 'UNISEX',
                featured: featured || false,
                status: 'ACTIVE',
                brandId: brand.id,
                categoryId: categoryRecord.id,
                inventory: {
                    create: {
                        quantity: 0,
                        minStock: 0
                    }
                },
                images: {
                    create: images?.map((url, index) => ({
                        url,
                        order: index
                    })) || []
                }
            },
            include: {
                brand: true,
                category: true,
                images: true,
                inventory: true
            }
        });

        res.json(product);
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// PUT /api/produtos/:id - Atualiza um produto
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            referencia,
            name,
            descricao,
            preco,
            size,
            marca,
            category,
            color,
            material,
            gender,
            featured,
            images
        } = req.body;

        // Busca ou cria a marca
        const brand = await prisma.brand.upsert({
            where: { name: marca },
            update: {},
            create: {
                name: marca,
                active: true
            }
        });

        // Busca ou cria a categoria
        const categoryRecord = await prisma.category.upsert({
            where: { name: category },
            update: {},
            create: {
                name: category,
                active: true
            }
        });

        // Atualiza o produto
        const product = await prisma.product.update({
            where: { id: parseInt(id) },
            data: {
                referenceCode: referencia,
                name,
                description: descricao,
                price: preco,
                size,
                color,
                material,
                gender: gender || 'UNISEX',
                featured: featured || false,
                brandId: brand.id,
                categoryId: categoryRecord.id,
                images: {
                    deleteMany: {},
                    create: images?.map((url, index) => ({
                        url,
                        order: index
                    })) || []
                }
            },
            include: {
                brand: true,
                category: true,
                images: true,
                inventory: true
            }
        });

        res.json(product);
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// DELETE /api/produtos/:id - Remove um produto (soft delete)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const product = await prisma.product.update({
            where: { id: parseInt(id) },
            data: {
                status: 'INACTIVE',
                deletedAt: new Date()
            }
        });

        res.json(product);
    } catch (error) {
        console.error('Erro ao remover produto:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// GET /api/produtos/brands - Lista todas as marcas
router.get('/brands', async (req, res) => {
    try {
        const brands = await prisma.brand.findMany({
            where: { active: true }
        });
        res.json(brands);
    } catch (error) {
        console.error('Erro ao buscar marcas:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// GET /api/produtos/categories - Lista todas as categorias
router.get('/categories', async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            where: { active: true }
        });
        res.json(categories);
    } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;
