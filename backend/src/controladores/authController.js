// backend/src/controladores/authController.js
const db = require('../database/database');
const crypto = require('crypto');

function hashSenha(senha) {
    return crypto.createHash('sha256').update(senha).digest('hex');
}

const authController = {
    
    // Realizar login
    login(req, res) {
        const { email, senha } = req.body;

      
        console.log('📧 Email recebido:', email);
        console.log('🔑 Senha recebida:', senha);

        if (!email || !senha) {
            return res.status(400).json({
                erro: "Email e senha são obrigatórios"
            });
        }

        try {
            const senhaHash = hashSenha(senha);
            
            // 🔥 ADICIONE ESTE LOG AQUI
            console.log('🔒 Hash gerado:', senhaHash);
            
            const stmt = db.prepare(`
                SELECT id, nome, email, telefone, cep, tipo 
                FROM usuarios 
                WHERE email = ? AND senha = ?
            `);
            
            const usuario = stmt.get(email, senhaHash);
            
            
            console.log('👤 Usuário encontrado:', usuario);
            
            if (!usuario) {
                return res.status(401).json({
                    erro: "Email ou senha inválidos"
                });
            }
            
            const token = Buffer.from(`${usuario.id}:${usuario.email}`).toString('base64');
            
            return res.status(200).json({
                mensagem: "Login realizado com sucesso",
                usuario: {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    tipo: usuario.tipo
                },
                token: token
            });
        } catch (error) {
            console.error('❌ Erro no login:', error);
            return res.status(500).json({
                erro: "Erro interno ao fazer login"
            });
        }
    },

    // Registrar novo usuário
    registrar(req, res) {
        const { nome, email, senha, telefone, cep } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({
                erro: "Nome, email e senha são obrigatórios"
            });
        }

        try {
            const senhaHash = hashSenha(senha);
            
            const stmt = db.prepare(`
                INSERT INTO usuarios (nome, email, senha, telefone, cep, tipo)
                VALUES (?, ?, ?, ?, ?, 'adotante')
            `);
            
            const info = stmt.run(nome, email, senhaHash, telefone || null, cep || null);
            
            return res.status(201).json({
                mensagem: "Usuário cadastrado com sucesso",
                usuario: {
                    id: info.lastInsertRowid,
                    nome: nome,
                    email: email,
                    tipo: 'adotante'
                }
            });
        } catch (error) {
            if (error.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({
                    erro: "Este e-mail já está cadastrado"
                });
            }
            console.error('Erro no cadastro:', error);
            return res.status(500).json({
                erro: "Erro interno ao cadastrar usuário"
            });
        }
    }
};

module.exports = authController;