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
    },

    // Login
    login(req, res) {
        const { email, senha } = req.body;
        
        try {
            const stmt = db.prepare('SELECT * FROM usuarios WHERE email = ? AND senha = ?');
            const usuario = stmt.get(email, senha);
            
            if (usuario) {
                const token = Buffer.from(`${usuario.id}:${usuario.email}`).toString('base64');  
                delete usuario.senha;
                res.json({
                    success: true,
                    message: 'Login realizado com sucesso!',
                    token: token, 
                    usuario: usuario,
                });
            } else {
                res.status(401).json({
                    success: false,
                    message: 'Email ou senha inválidos!'
                });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Buscar usuário por ID
    buscarPorId(req, res) {
        const { id } = req.params;
        
        try {
            const stmt = db.prepare(`
                SELECT id, nome, email, telefone, cep, tipo, created_at 
                FROM usuarios WHERE id = ?
            `);
            const usuario = stmt.get(id);
            
            if (usuario) {
                res.json({ success: true, usuario });
            } else {
                res.status(404).json({ success: false, message: 'Usuário não encontrado!' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Atualizar usuário
    atualizar(req, res) {
        const { id } = req.params;
        const { nome, email, telefone, cep } = req.body;
        
        try {
            const stmt = db.prepare(`
                UPDATE usuarios 
                SET nome = ?, email = ?, telefone = ?, cep = ?
                WHERE id = ?
            `);
            
            const result = stmt.run(nome, email, telefone, cep, id);
            
            if (result.changes > 0) {
                res.json({ success: true, message: 'Usuário atualizado com sucesso!' });
            } else {
                res.status(404).json({ success: false, message: 'Usuário não encontrado!' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Deletar usuário
    deletar(req, res) {
        const { id } = req.params;
        
        try {
            const stmt = db.prepare('DELETE FROM usuarios WHERE id = ?');
            const result = stmt.run(id);
            
            if (result.changes > 0) {
                res.json({ success: true, message: 'Usuário deletado com sucesso!' });
            } else {
                res.status(404).json({ success: false, message: 'Usuário não encontrado!' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Buscar endereço por CEP (integração ViaCEP)
    async buscarCep(req, res) {
        const { cep } = req.body;
        
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const endereco = await response.json();
            
            if (!endereco.erro) {
                res.json({
                    success: true,
                    endereco: {
                        logradouro: endereco.logradouro,
                        bairro: endereco.bairro,
                        cidade: endereco.localidade,
                        estado: endereco.uf
                    }
                });
            } else {
                res.status(404).json({ success: false, message: 'CEP não encontrado!' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Definir preferências do usuário
    definirPreferencias(req, res) {
        const { id } = req.params;
        const { especie_pref, porte_pref, idade_min, idade_max } = req.body;
        
        try {
            const checkStmt = db.prepare('SELECT id FROM preferencias WHERE usuario_id = ?');
            const existe = checkStmt.get(id);
            
            if (existe) {
                const stmt = db.prepare(`
                    UPDATE preferencias 
                    SET especie_pref = ?, porte_pref = ?, idade_min = ?, idade_max = ?
                    WHERE usuario_id = ?
                `);
                stmt.run(especie_pref, porte_pref, idade_min, idade_max, id);
                res.json({ success: true, message: 'Preferências atualizadas com sucesso!' });
            } else {
                const stmt = db.prepare(`
                    INSERT INTO preferencias (usuario_id, especie_pref, porte_pref, idade_min, idade_max)
                    VALUES (?, ?, ?, ?, ?)
                `);
                stmt.run(id, especie_pref, porte_pref, idade_min, idade_max);
                res.status(201).json({ success: true, message: 'Preferências cadastradas com sucesso!' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Buscar preferências do usuário
    buscarPreferencias(req, res) {
        const { id } = req.params;
        
        try {
            const stmt = db.prepare('SELECT * FROM preferencias WHERE usuario_id = ?');
            const preferencias = stmt.get(id);
            
            res.json({ success: true, preferencias: preferencias || null });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = usuarioController;