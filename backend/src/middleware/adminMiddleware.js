// backend/src/middleware/adminMiddleware.js
const db = require('../database/database');  // ← database.js

const adminMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    
    if (!token) {
        return res.status(401).json({ erro: "Token não fornecido. Faça login." });
    }
    
    try {
        const decoded = Buffer.from(token, 'base64').toString();
        const [userId, userEmail] = decoded.split(':');
        
        if (!userId || !userEmail) {
            return res.status(401).json({ erro: "Token inválido" });
        }
        
        const usuario = db.prepare('SELECT id, tipo FROM usuarios WHERE id = ? AND email = ?').get(userId, userEmail);
        
        if (!usuario) {
            return res.status(401).json({ erro: "Usuário não encontrado" });
        }
        
        if (usuario.tipo !== 'admin') {
            return res.status(403).json({ erro: "Acesso negado. Área restrita para administradores." });
        }
        
        req.usuario = { id: usuario.id, tipo: usuario.tipo };
        next();
    } catch (error) {
        return res.status(401).json({ erro: "Token inválido" });
    }
};

module.exports = adminMiddleware;