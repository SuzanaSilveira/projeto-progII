const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  CAMINHOS DO FRONTEND
const frontendPath = path.join(__dirname, '../../frontend/pages');
const cssPath = path.join(__dirname, '../../frontend/css');
const jsPath = path.join(__dirname, '../../frontend/js');

console.log(' Frontend:', frontendPath);
console.log(' CSS:', cssPath);
console.log(' JS:', jsPath);

// Servir arquivos estáticos
app.use('/css', express.static(cssPath));
app.use('/js', express.static(jsPath));
app.use(express.static(frontendPath));

//  Uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

//  ROTAS DA API (DEVEM VIR ANTES DA ROTA CURINGA)
const authRoutes = require('./rotas/authRoutes');
const adminRoutes = require('./rotas/adminRoutes');
const uploadRoutes = require('./rotas/uploadRoutes');
const publicRoutes = require('./rotas/publicRoutes');
const favoritoRoutes = require('./rotas/favoritoRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', uploadRoutes);
app.use('/api/animais', publicRoutes);
app.use('/api/favoritos', favoritoRoutes);

//  Página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

//  ROTA CURINGA: SÓ PARA PÁGINAS HTML (DEIXA A API EM PAZ)
app.get('*.html', (req, res) => {
    const fileName = path.basename(req.path);
    res.sendFile(path.join(frontendPath, fileName));
});

//  ROTA CURINGA: REDIRECIONA QUALQUER OUTRA COISA PARA O INDEX (SOMENTE SE FOR PÁGINA)
app.get('*', (req, res) => {
    // Se não for uma requisição de API, envia o index.html
    if (!req.path.startsWith('/api/') && !req.path.startsWith('/css/') && !req.path.startsWith('/js/') && !req.path.startsWith('/uploads/')) {
        res.sendFile(path.join(frontendPath, 'index.html'));
    } else {
        res.status(404).json({ erro: 'Recurso não encontrado' });
    }
});

// Middleware de erro
app.use((err, req, res, next) => {
    console.error(' Erro:', err.message);
    if (err.message === 'Apenas imagens são permitidas!') {
        return res.status(400).json({ erro: err.message });
    }
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ erro: 'Arquivo muito grande! Máximo 5MB' });
    }
    res.status(500).json({ erro: 'Erro interno no servidor' });
});

app.listen(PORT, () => {
    console.log(` Servidor rodando: http://localhost:${PORT}`);
    console.log(` Frontend: ${frontendPath}`);
    console.log(` Auth API: http://localhost:${PORT}/api/auth`);
    console.log(` Upload: http://localhost:${PORT}/api/upload`);
    console.log(` Admin: http://localhost:${PORT}/api/admin`);
});

