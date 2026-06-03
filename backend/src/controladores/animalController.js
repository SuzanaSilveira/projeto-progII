const db = require('../database/database.js');
const fs = require('fs');
const path = require('path');

const animalController = {
    // Cadastrar novo animal
    cadastrar(req, res) {
        const { nome, especie, idade, porte, descricao, imagem_url, administrador_id } = req.body;
        
        try {
            const stmt = db.prepare(`
                INSERT INTO animais (nome, especie, idade, porte, descricao, imagem_url, administrador_id)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `);
            
            const result = stmt.run(nome, especie, idade, porte, descricao, imagem_url, administrador_id);
            
            res.status(201).json({
                success: true,
                message: 'Animal cadastrado com sucesso!',
                id: result.lastInsertRowid
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Listar todos os animais
    listarTodos(req, res) {
        try {
            const stmt = db.prepare(`
                SELECT a.*, u.nome as responsavel_nome, u.telefone as responsavel_telefone 
                FROM animais a
                LEFT JOIN usuarios u ON a.administrador_id = u.id
                ORDER BY a.created_at DESC
            `);
            const animais = stmt.all();
            
            res.json({ success: true, animais });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Listar apenas animais disponíveis
    listarDisponiveis(req, res) {
        try {
            const stmt = db.prepare(`
                SELECT a.*, u.nome as responsavel_nome, u.telefone as responsavel_telefone 
                FROM animais a
                LEFT JOIN usuarios u ON a.administrador_id = u.id
                WHERE a.status = 'disponivel'
                ORDER BY a.created_at DESC
            `);
            const animais = stmt.all();
            
            res.json({ success: true, animais });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Buscar animal por ID
    buscarPorId(req, res) {
        const { id } = req.params;
        
        try {
            const stmt = db.prepare(`
                SELECT a.*, u.nome as responsavel_nome, u.telefone as responsavel_telefone, u.email as responsavel_email
                FROM animais a
                LEFT JOIN usuarios u ON a.administrador_id = u.id
                WHERE a.id = ?
            `);
            const animal = stmt.get(id);
            
            if (animal) {
                res.json({ success: true, animal });
            } else {
                res.status(404).json({ success: false, message: 'Animal não encontrado!' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Buscar animais por espécie
    buscarPorEspecie(req, res) {
        const { especie } = req.params;
        
        try {
            const stmt = db.prepare(`
                SELECT * FROM animais 
                WHERE especie LIKE ? AND status = 'disponivel'
            `);
            const animais = stmt.all(`%${especie}%`);
            
            res.json({ success: true, animais });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Buscar animais por porte
    buscarPorPorte(req, res) {
        const { porte } = req.params;
        
        try {
            const stmt = db.prepare(`
                SELECT * FROM animais 
                WHERE porte = ? AND status = 'disponivel'
            `);
            const animais = stmt.all(porte);
            
            res.json({ success: true, animais });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Buscar por preferências do usuário
    buscarPorPreferencias(req, res) {
        const { especie_pref, porte_pref, idade_min, idade_max } = req.body;
        
        let query = `SELECT * FROM animais WHERE status = 'disponivel'`;
        const params = [];
        
        if (especie_pref) {
            query += ` AND especie LIKE ?`;
            params.push(`%${especie_pref}%`);
        }
        
        if (porte_pref) {
            query += ` AND porte = ?`;
            params.push(porte_pref);
        }
        
        if (idade_min) {
            query += ` AND idade >= ?`;
            params.push(idade_min);
        }
        
        if (idade_max) {
            query += ` AND idade <= ?`;
            params.push(idade_max);
        }
        
        try {
            const stmt = db.prepare(query);
            const animais = stmt.all(...params);
            res.json({ success: true, animais });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Atualizar animal
    atualizar(req, res) {
        const { id } = req.params;
        const { nome, especie, idade, porte, descricao, imagem_url, status } = req.body;
        
        try {
            const stmt = db.prepare(`
                UPDATE animais 
                SET nome = ?, especie = ?, idade = ?, porte = ?, descricao = ?, imagem_url = ?, status = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `);
            
            const result = stmt.run(nome, especie, idade, porte, descricao, imagem_url, status, id);
            
            if (result.changes > 0) {
                res.json({ success: true, message: 'Animal atualizado com sucesso!' });
            } else {
                res.status(404).json({ success: false, message: 'Animal não encontrado!' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Atualizar status do animal (disponivel/adotado/inativo)
    atualizarStatus(req, res) {
        const { id } = req.params;
        const { status } = req.body;
        
        try {
            const stmt = db.prepare(`
                UPDATE animais 
                SET status = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `);
            
            const result = stmt.run(status, id);
            
            if (result.changes > 0) {
                res.json({ success: true, message: `Status alterado para ${status}` });
            } else {
                res.status(404).json({ success: false, message: 'Animal não encontrado!' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // 🆕 Deletar animal e sua foto associada
    deletar(req, res) {
        const { id } = req.params;
        
        try {
            // Primeiro, buscar a imagem do animal
            const animalStmt = db.prepare('SELECT imagem_url FROM animais WHERE id = ?');
            const animal = animalStmt.get(id);
            
            // Deletar o animal do banco
            const stmt = db.prepare('DELETE FROM animais WHERE id = ?');
            const result = stmt.run(id);
            
            if (result.changes > 0) {
                // Se tiver imagem, deletar o arquivo da pasta uploads
                if (animal && animal.imagem_url) {
                    const imagePath = path.join(__dirname, '..', '..', animal.imagem_url);
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                    }
                }
                
                res.json({ success: true, message: 'Animal deletado com sucesso!' });
            } else {
                res.status(404).json({ success: false, message: 'Animal não encontrado!' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Enviar contato sobre o animal (WhatsApp)
    enviarContato(req, res) {
        const { id } = req.params;
        const { remetente_id, mensagem, telefone_responsavel } = req.body;
        
        try {
            // Registrar contato no banco
            const stmt = db.prepare(`
                INSERT INTO contatos (remetente_id, animal_id, mensagem)
                VALUES (?, ?, ?)
            `);
            stmt.run(remetente_id, id, mensagem);
            
            // Gerar link do WhatsApp
            const numeroWhatsApp = telefone_responsavel.replace(/\D/g, '');
            const textoWhatsApp = encodeURIComponent(`Olá! Tenho interesse no animal. ${mensagem}`);
            const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${textoWhatsApp}`;
            
            res.json({
                success: true,
                message: 'Contato registrado!',
                linkWhatsApp: linkWhatsApp
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // 🆕 Buscar animais por administrador (para o admin ver seus animais)
    buscarPorAdministrador(req, res) {
        const { administrador_id } = req.params;
        
        try {
            const stmt = db.prepare(`
                SELECT * FROM animais 
                WHERE administrador_id = ?
                ORDER BY created_at DESC
            `);
            const animais = stmt.all(administrador_id);
            
            res.json({ success: true, animais });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = animalController;