const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const produtosRouter = require('./routes/produtos');

// Carrega variáveis de ambiente
dotenv.config();

const app = express();

// Configuração do CORS
const corsOptions = {
    origin: 'http://localhost:3001',  // Altere para a origem do seu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204
};

// Configuração do Rate Limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // limite de 100 requisições por IP
    message: { error: 'Muitas requisições deste IP, tente novamente mais tarde' }
});

// Middleware de segurança e otimização
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false
})); // Segurança
app.use(compression()); // Compressão GZIP
app.use(morgan('dev')); // Logging mais detalhado em desenvolvimento
app.use(express.static(path.join(__dirname, '../public'))); // Servir arquivos estáticos
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use('/api', limiter);

// Middleware para logging de requisições
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Timeout para requisições
app.use((req, res, next) => {
    req.setTimeout(30000); // 30 segundos
    res.setTimeout(30000);
    next();
});

// Rotas da API
app.use('/api/produtos', produtosRouter);

// Rota para servir o index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Rota para servir o listing.html
app.get('/listing', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/listing.html'));
});

// Rota para servir o cadastro.html
app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/cadastro.html'));
});

// Rota de status da API
app.get('/api/status', (req, res) => {
    res.json({ 
        status: 'online',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error('Erro na aplicação:', err);
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'development' ? err.message : 'Erro interno do servidor',
        timestamp: new Date().toISOString()
    });
});

// Rota de healthcheck
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Tratamento de erros 404
app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

// Função para iniciar o servidor
async function startServer() {
    try {
        const port = process.env.PORT || 4000;
        const host = process.env.HOST || '127.0.0.1';
        
        app.listen(port, host, () => {
            console.log(`Servidor rodando em http://${host}:${port}`);
        });
    } catch (error) {
        console.error('Erro ao iniciar servidor:', error);
        process.exit(1);
    }
}

startServer();

// Tratamento de erros não capturados
process.on('uncaughtException', (err) => {
    console.error('Erro não capturado:', err);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('Promise rejeitada não tratada:', err);
    process.exit(1);
});
