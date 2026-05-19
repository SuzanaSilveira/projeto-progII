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
});