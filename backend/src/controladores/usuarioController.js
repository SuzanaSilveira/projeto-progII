const db = require('../database/database.js');

const usuarioController = {
    // Cadastrar novo usuário
    cadastrar(req, res) {
        const { nome, email, senha, telefone, cep, tipo } = req.body;
        
        try {
            const stmt = db.prepare(`
                INSERT INTO usuarios (nome, email, senha, telefone, cep, tipo)
                VALUES (?, ?, ?, ?, ?, ?)
            `);
            
            const result = stmt.run(nome, email, senha, telefone, cep, tipo || 'adotante');
            
            res.status(201).json({
                success: true,
                message: 'Usuário cadastrado com sucesso!',
                id: result.lastInsertRowid
            });
        } catch (error) {
            if (error.message.includes('UNIQUE constraint failed')) {
                res.status(400).json({ success: false, message: 'Email já cadastrado!' });
            } else {
                res.status(500).json({ success: false, message: error.message });
            }
        }
    }
};

module.exports = usuarioController;