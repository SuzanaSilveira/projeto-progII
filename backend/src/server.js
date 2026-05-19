<<<<<<< HEAD
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar rotas
const usuariosRoutes = require('./rotas/Usuario');
const animaisRoutes = require('./rotas/Animal');

// Usar rotas
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/animais', animaisRoutes);

// Rota de teste
app.get('/', (req, res) => {
    res.json({ message: 'API Amigo Fiel funcionando!' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`http://localhost:${PORT}`);
=======
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Importar rotas
const usuariosRoutes = require('./rotas/Usuario');
const animaisRoutes = require('./rotas/Animal');

// Usar rotas
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/animais', animaisRoutes);

// Rota teste
app.get('/', (req, res) => {
    res.json({ message: 'API Amigo Fiel funcionando!' });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando: http://localhost:${PORT}`);
    console.log(`Swagger: http://localhost:${PORT}/api-docs`);
>>>>>>> e28b37d8f03d24924f829b6d4912b863dc29056b
});