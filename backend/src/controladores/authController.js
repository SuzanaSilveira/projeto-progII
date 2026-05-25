// backend/src/controllers/authController.js

const db = require('../database/db');
const crypto = require('crypto');

// Função para criptografar senha
function hashSenha(senha) {
    return crypto.createHash('sha256').update(senha).digest('hex');
}

// Função para gerar token aleatório
function gerarToken() {
    return crypto.randomBytes(32).toString('hex');
}

const authController = {
    
    // Realizar login
    login(req, res) {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                erro: "Email e senha são obrigatórios"
            });
        }

        try {
            const senhaHash = hashSenha(senha);
            
            const stmt = db.prepare(`
                SELECT id, nome, email, telefone, cep, tipo 
                FROM usuarios 
                WHERE email = ? AND senha = ?
            `);
            
            const usuario = stmt.get(email, senhaHash);
            
            if (!usuario) {
                return res.status(401).json({
                    erro: "Email ou senha inválidos"
                });
            }
            
            return res.status(200).json({
                mensagem: "Login realizado com sucesso",
                usuario: usuario
            });
        } catch (error) {
            console.error('Erro no login:', error);
            return res.status(500).json({
                erro: "Erro interno ao fazer login"
            });
        }
    },

    // Realizar cadastro
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
                    email: email
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
    },

    // 🆕 Esqueci a senha - gerar token de recuperação
    esqueciSenha(req, res) {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ erro: "Email é obrigatório" });
        }

        try {
            // Verificar se o usuário existe
            const usuario = db.prepare('SELECT id FROM usuarios WHERE email = ?').get(email);
            
            if (!usuario) {
                // Por segurança, não informamos que o email não existe
                return res.status(200).json({
                    mensagem: "Se o email existir, enviaremos as instruções de recuperação"
                });
            }

            // Gerar token e salvar
            const token = gerarToken();
            const expiraEm = new Date();
            expiraEm.setHours(expiraEm.getHours() + 1); // Expira em 1 hora

            db.prepare(`
                INSERT INTO recuperacao_senha (usuario_id, token, expira_em)
                VALUES (?, ?, ?)
            `).run(usuario.id, token, expiraEm.toISOString());

            // Aqui você enviaria o token por email
            // Por enquanto, só retornamos o token (em produção, NÃO faça isso!)
            return res.status(200).json({
                mensagem: "Token de recuperação gerado",
                token: token // Em produção, isso iria por email, não na resposta!
            });

        } catch (error) {
            console.error('Erro ao gerar token:', error);
            return res.status(500).json({ erro: "Erro interno" });
        }
    },

    // 🆕 Resetar senha
    resetarSenha(req, res) {
        const { token, novaSenha } = req.body;

        if (!token || !novaSenha) {
            return res.status(400).json({
                erro: "Token e nova senha são obrigatórios"
            });
        }

        try {
            // Verificar se o token é válido
            const recuperacao = db.prepare(`
                SELECT usuario_id, expira_em, usado 
                FROM recuperacao_senha 
                WHERE token = ?
            `).get(token);

            if (!recuperacao) {
                return res.status(400).json({ erro: "Token inválido" });
            }

            if (recuperacao.usado === 1) {
                return res.status(400).json({ erro: "Token já utilizado" });
            }

            const agora = new Date();
            const expira = new Date(recuperacao.expira_em);

            if (agora > expira) {
                return res.status(400).json({ erro: "Token expirado" });
            }

            // Atualizar a senha do usuário
            const novaSenhaHash = hashSenha(novaSenha);
            db.prepare('UPDATE usuarios SET senha = ? WHERE id = ?')
                .run(novaSenhaHash, recuperacao.usuario_id);

            // Marcar token como usado
            db.prepare('UPDATE recuperacao_senha SET usado = 1 WHERE token = ?')
                .run(token);

            return res.status(200).json({
                mensagem: "Senha alterada com sucesso"
            });

        } catch (error) {
            console.error('Erro ao resetar senha:', error);
            return res.status(500).json({ erro: "Erro interno" });
        }
    }
};

module.exports = authController;