// backend/src/rotas/publicRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../database/database.js');

// Listar animais disponíveis (público)
router.get('/disponiveis', (req, res) => {
    try {
        const animais = db.prepare(`
            SELECT a.*, u.nome as responsavel_nome, u.telefone as responsavel_telefone 
            FROM animais a
            LEFT JOIN usuarios u ON a.administrador_id = u.id
            WHERE a.status = 'disponivel'
            ORDER BY a.created_at DESC
        `).all();
        res.json({ success: true, animais });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Buscar animal por ID (público)
router.get('/:id', (req, res) => {
    const { id } = req.params;
    try {
        const animal = db.prepare(`
            SELECT a.*, u.nome as responsavel_nome, u.telefone as responsavel_telefone, u.email as responsavel_email
            FROM animais a
            LEFT JOIN usuarios u ON a.administrador_id = u.id
            WHERE a.id = ?
        `).get(id);
        
        if (animal) {
            res.json({ success: true, animal });
        } else {
            res.status(404).json({ success: false, message: 'Animal não encontrado!' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Registrar interesse (precisa estar logado, mas é público)
router.post('/:id/contato', (req, res) => {
    const { id } = req.params;
    const { remetente_id, mensagem } = req.body;
    
    if (!remetente_id) {
        return res.status(400).json({ success: false, message: 'remetente_id é obrigatório.' });
    }
    if (!mensagem?.trim()) {
        return res.status(400).json({ success: false, message: 'mensagem é obrigatória.' });
    }
    
    try {
        const animal = db.prepare('SELECT id FROM animais WHERE id = ?').get(id);
        if (!animal) {
            return res.status(404).json({ success: false, message: 'Animal não encontrado.' });
        }
        
        const result = db.prepare(`
            INSERT INTO contatos (remetente_id, animal_id, mensagem) 
            VALUES (?, ?, ?)
        `).run(remetente_id, id, mensagem.trim());
        
        res.status(201).json({ 
            success: true, 
            message: 'Interesse registrado com sucesso.', 
            contato_id: result.lastInsertRowid 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;