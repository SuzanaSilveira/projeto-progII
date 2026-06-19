const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

try {

    // Middlewares
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Frontend (CSS, JS, HTML, imagens...)
    app.use(express.static(path.join(__dirname, '../../frontend')));

    // Uploads
    app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

    // Swagger
    const options = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'API Amigo Fiel',
                version: '1.0.0',
                description: 'API para gerenciamento de usuários e animais'
            }
        },
        apis: [
            path.join(__dirname, 'rotas', 'Animal.js'),
            path.join(__dirname, 'rotas', 'Usuario.js')
        ]
    };

    const specs = swaggerJsdoc(options);

    app.use(
        '/api-docs',
        swaggerUi.serve,
        swaggerUi.setup(specs)
    );

    // Rotas
    const usuariosRoutes = require('./rotas/Usuario');
    const animaisRoutes = require('./rotas/Animal');
    const authRoutes = require('./rotas/authRoutes');
    const adminRoutes = require('./rotas/adminRoutes');
    const uploadRoutes = require('./rotas/uploadRoutes');

    app.use('/api/usuarios', usuariosRoutes);
    app.use('/api/animais', animaisRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api', uploadRoutes);

    // Página inicial
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../../frontend/pages/index.html'));
    });

    // Middleware global de erro
    app.use((err, req, res, next) => {
        console.error('Erro:', err.message);

        if (err.message === 'Apenas imagens são permitidas!') {
            return res.status(400).json({ erro: err.message });
        }

        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ erro: 'Arquivo muito grande! Máximo 5MB' });
        }

        res.status(500).json({
            erro: 'Erro interno no servidor'
        });
    });

    // Iniciar servidor
    app.listen(PORT, () => {
        console.log(`Servidor rodando: http://localhost:${PORT}`);
        console.log(`Página inicial: http://localhost:${PORT}`);
        console.log(`Swagger: http://localhost:${PORT}/api-docs`);
        console.log(`Auth API: http://localhost:${PORT}/api/auth`);
        console.log(`Upload API: http://localhost:${PORT}/api/upload`);
    });

} catch (erro) {
    console.error('Falha ao iniciar servidor:');
    console.error(erro.message);
}

process.on('uncaughtException', (erro) => {
    console.error('Erro não tratado:', erro.message);
});

process.on('unhandledRejection', (erro) => {
    console.error('Promessa rejeitada:', erro);
});