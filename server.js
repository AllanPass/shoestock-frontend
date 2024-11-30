const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const Produto = require('./models/Produto');

const app = express();
const port = process.env.PORT || 3010;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Configuração do Multer para upload de imagens
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Apenas imagens são permitidas!'));
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

// Validação de dados
const validateProduto = (req, res, next) => {
    const { referencia, marca, descricao, preco } = req.body;
    if (!referencia || !marca || !descricao || !preco) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
    if (isNaN(preco) || preco <= 0) {
        return res.status(400).json({ error: 'Preço inválido' });
    }
    next();
};

// Rotas
// GET - Listar todos os produtos
app.get('/api/produtos', async (req, res, next) => {
    try {
        const produtos = await Produto.findAll();
        res.json(produtos);
    } catch (error) {
        next(error);
    }
});

// GET - Buscar produto por ID
app.get('/api/produtos/:id', async (req, res, next) => {
    try {
        const produto = await Produto.findByPk(req.params.id);
        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        res.json(produto);
    } catch (error) {
        next(error);
    }
});

// POST - Cadastrar produto
app.post('/api/produtos', upload.single('imagem'), validateProduto, async (req, res, next) => {
    try {
        const { referencia, marca, descricao, preco } = req.body;
        const imagem = req.file ? `/uploads/${req.file.filename}` : null;

        const produto = await Produto.create({
            referencia,
            marca,
            descricao,
            preco,
            imagem
        });

        res.status(201).json(produto);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Referência já existe' });
        }
        next(error);
    }
});

// PUT - Atualizar produto
app.put('/api/produtos/:id', upload.single('imagem'), validateProduto, async (req, res, next) => {
    try {
        const produto = await Produto.findByPk(req.params.id);
        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        const { referencia, marca, descricao, preco } = req.body;
        const imagem = req.file ? `/uploads/${req.file.filename}` : produto.imagem;

        // Se houver nova imagem, deletar a antiga
        if (req.file && produto.imagem) {
            const oldImagePath = path.join(__dirname, produto.imagem);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        await produto.update({
            referencia,
            marca,
            descricao,
            preco,
            imagem
        });

        res.json(produto);
    } catch (error) {
        next(error);
    }
});

// DELETE - Remover produto
app.delete('/api/produtos/:id', async (req, res, next) => {
    try {
        const produto = await Produto.findByPk(req.params.id);
        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        // Deletar imagem se existir
        if (produto.imagem) {
            const imagePath = path.join(__dirname, produto.imagem);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await produto.destroy();
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

// Middleware de erro global
app.use((err, req, res, next) => {
    console.error(err.stack);
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'Arquivo muito grande. Máximo 5MB.' });
        }
        return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
});

// Criar pasta de uploads se não existir
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
