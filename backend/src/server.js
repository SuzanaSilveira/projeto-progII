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

    // Servir arquivos estáticos
    app.use(express.static(path.join(__dirname, 'public')));

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

    app.use('/api-docs',
        swaggerUi.serve,
        swaggerUi.setup(specs)
    );

    // Importar rotas
    const usuariosRoutes = require('./rotas/Usuario');
    const animaisRoutes = require('./rotas/Animal');
    const authRoutes = require('./rotas/authRoutes');      // 🆕 ROTA DE AUTENTICAÇÃO
    const adminRoutes = require('./rotas/adminRoutes');

    // Rotas API
    app.use('/api/usuarios', usuariosRoutes);
    app.use('/api/animais', animaisRoutes);
    app.use('/api/auth', authRoutes);                       // 🆕 REGISTRANDO AUTH
    app.use('/api/admin', adminRoutes);

    // Página principal
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    // Middleware global de erro
    app.use((err, req, res, next) => {
        console.error("Erro:", err.message);

        res.status(500).json({
            erro: "Erro interno no servidor"
        });
    });

    // Iniciar servidor
    app.listen(PORT, () => {
        console.log(`Servidor rodando: http://localhost:${PORT}`);
        console.log(`Swagger: http://localhost:${PORT}/api-docs`);
        console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);  // 🆕
    });

} catch (erro) {

    console.error("Falha ao iniciar servidor:");
    console.error(erro.message);

}


// Captura erros não tratados
process.on('uncaughtException', (erro) => {
    console.error('Erro não tratado:', erro.message);
});

process.on('unhandledRejection', (erro) => {
    console.error('Promessa rejeitada:', erro);
});