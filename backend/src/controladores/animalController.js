const db = require('../database/database.js');
const fs = require('fs');
const path = require('path');

const animalController = {

    cadastrar(req, res) {
        const { nome, especie, idade, porte, descricao, imagem_url, administrador_id } = req.body;
        try {
            const stmt = db.prepare(`INSERT INTO animais (nome, especie, idade, porte, descricao, imagem_url, administrador_id) VALUES (?, ?, ?, ?, ?, ?, ?)`);
            const result = stmt.run(nome, especie, idade, porte, descricao, imagem_url, administrador_id);
            res.status(201).json({ success: true, message: 'Animal cadastrado com sucesso!', id: result.lastInsertRowid });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    listarTodos(req, res) {
        try {
            const animais = db.prepare(`SELECT a.*, u.nome as responsavel_nome, u.telefone as responsavel_telefone FROM animais a LEFT JOIN usuarios u ON a.administrador_id = u.id ORDER BY a.created_at DESC`).all();
            res.json({ success: true, animais });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    listarDisponiveis(req, res) {
        try {
            const animais = db.prepare(`SELECT a.*, u.nome as responsavel_nome, u.telefone as responsavel_telefone FROM animais a LEFT JOIN usuarios u ON a.administrador_id = u.id WHERE a.status = 'disponivel' ORDER BY a.created_at DESC`).all();
            res.json({ success: true, animais });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    buscarPorId(req, res) {
        const { id } = req.params;
        try {
            const animal = db.prepare(`SELECT a.*, u.nome as responsavel_nome, u.telefone as responsavel_telefone, u.email as responsavel_email FROM animais a LEFT JOIN usuarios u ON a.administrador_id = u.id WHERE a.id = ?`).get(id);
            if (animal) res.json({ success: true, animal });
            else res.status(404).json({ success: false, message: 'Animal não encontrado!' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    buscarPorEspecie(req, res) {
        const { especie } = req.params;
        try {
            const animais = db.prepare(`SELECT * FROM animais WHERE especie LIKE ? AND status = 'disponivel'`).all(`%${especie}%`);
            res.json({ success: true, animais });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    buscarPorPorte(req, res) {
        const { porte } = req.params;
        try {
            const animais = db.prepare(`SELECT * FROM animais WHERE porte = ? AND status = 'disponivel'`).all(porte);
            res.json({ success: true, animais });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    buscarPorPreferencias(req, res) {
        const { especie_pref, porte_pref, idade_min, idade_max } = req.body;
        let query = `SELECT * FROM animais WHERE status = 'disponivel'`;
        const params = [];
        if (especie_pref) { query += ` AND especie LIKE ?`; params.push(`%${especie_pref}%`); }
        if (porte_pref) { query += ` AND porte = ?`; params.push(porte_pref); }
        if (idade_min) { query += ` AND idade >= ?`; params.push(idade_min); }
        if (idade_max) { query += ` AND idade <= ?`; params.push(idade_max); }
        try {
            const animais = db.prepare(query).all(...params);
            res.json({ success: true, animais });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

atualizar(req, res) {
    const { id } = req.params;
    const { nome, especie, idade, porte, descricao, imagem_url, status } = req.body;
    
    try {
        const stmt = db.prepare(`
            UPDATE animais 
            SET nome = ?, especie = ?, idade = ?, porte = ?, descricao = ?, imagem_url = ?, status = ?
            WHERE id = ?
        `);
        
        const result = stmt.run(nome, especie, idade, porte, descricao, imagem_url, status || 'disponivel', id);
        
        if (result.changes > 0) {
            res.json({ success: true, message: 'Animal atualizado com sucesso!' });
        } else {
            res.status(404).json({ success: false, message: 'Animal não encontrado!' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
},

    atualizarStatus(req, res) {
        const { id } = req.params;
        const { status } = req.body;
        try {
            const result = db.prepare(`UPDATE animais SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(status, id);
            if (result.changes > 0) res.json({ success: true, message: `Status alterado para ${status}` });
            else res.status(404).json({ success: false, message: 'Animal não encontrado!' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    deletar(req, res) {
        const { id } = req.params;
        try {
            const animal = db.prepare('SELECT imagem_url FROM animais WHERE id = ?').get(id);
            const result = db.prepare('DELETE FROM animais WHERE id = ?').run(id);
            if (result.changes > 0) {
                if (animal?.imagem_url) {
                    const imagePath = path.join(__dirname, '..', '..', animal.imagem_url);
                    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
                }
                res.json({ success: true, message: 'Animal deletado com sucesso!' });
            } else {
                res.status(404).json({ success: false, message: 'Animal não encontrado!' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    enviarContato(req, res) {
        const { id } = req.params;
        const { remetente_id, mensagem, telefone_responsavel } = req.body;
        try {
            db.prepare(`INSERT INTO contatos (remetente_id, animal_id, mensagem) VALUES (?, ?, ?)`).run(remetente_id, id, mensagem);
            const numeroWhatsApp = telefone_responsavel.replace(/\D/g, '');
            const textoWhatsApp = encodeURIComponent(`Olá! Tenho interesse no animal. ${mensagem}`);
            res.json({ success: true, message: 'Contato registrado!', linkWhatsApp: `https://wa.me/${numeroWhatsApp}?text=${textoWhatsApp}` });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    buscarPorAdministrador(req, res) {
        const { administrador_id } = req.params;
        try {
            const animais = db.prepare(`SELECT * FROM animais WHERE administrador_id = ? ORDER BY created_at DESC`).all(administrador_id);
            res.json({ success: true, animais });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    registrarContato(req, res) {
        const { id } = req.params;
        const { remetente_id, mensagem } = req.body;
        if (!remetente_id) return res.status(400).json({ success: false, message: 'remetente_id é obrigatório.' });
        if (!mensagem?.trim()) return res.status(400).json({ success: false, message: 'mensagem é obrigatória.' });
        try {
            const animal = db.prepare('SELECT id FROM animais WHERE id = ?').get(id);
            if (!animal) return res.status(404).json({ success: false, message: 'Animal não encontrado.' });
            const result = db.prepare('INSERT INTO contatos (remetente_id, animal_id, mensagem) VALUES (?, ?, ?)').run(remetente_id, id, mensagem.trim());
            res.status(201).json({ success: true, message: 'Interesse registrado com sucesso.', contato_id: result.lastInsertRowid });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    listarContatos(req, res) {
        try {
            const contatos = db.prepare(
                'SELECT c.id, c.mensagem, c.status, c.data_contato, u.nome AS remetente_nome, u.email AS remetente_email, a.nome AS animal_nome, a.especie AS animal_especie FROM contatos c LEFT JOIN usuarios u ON c.remetente_id = u.id LEFT JOIN animais a ON c.animal_id = a.id ORDER BY c.data_contato DESC'
            ).all();
            res.json({ success: true, contatos });
        } catch (error) {
            console.error('ERRO listarContatos:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    atualizarStatusContato(req, res) {
        const { id } = req.params;
        const { status } = req.body;
        try {
            const result = db.prepare('UPDATE contatos SET status = ? WHERE id = ?').run(status, id);
            if (result.changes > 0) res.json({ success: true });
            else res.status(404).json({ success: false, message: 'Contato não encontrado.' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
};

module.exports = animalController;