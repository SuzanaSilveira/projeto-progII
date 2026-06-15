const db = require('../database/database');

const authController = {
    // Realizar login
    login(req, res) {
        const { email, senha } = req.body;

        console.log(' Login tentativa:', email);

        if (!email || !senha) {
            return res.status(400).json({
                erro: "Email e senha são obrigatórios"
            });
        }

        try {
            // Buscar usuário por email 
            const stmt = db.prepare(`SELECT * FROM usuarios WHERE email = ?`);
            const usuario = stmt.get(email);
            
            // VERIFICAÇÃO 1: Usuário existe?
            if (!usuario) {
                console.log(' Usuário não encontrado:', email);
                return res.status(401).json({
                    erro: "Usuário não encontrado!"
                });
            }
            
            // VERIFICAÇÃO 2: Senha está correta?
            if (usuario.senha !== senha) {
                console.log(' Senha incorreta para:', email);
                return res.status(401).json({
                    erro: "Senha incorreta!"
                });
            }
            
            // GERAR TOKEN 
            const token = Buffer.from(`${usuario.id}:${usuario.email}`).toString('base64');
            
            console.log(' Login realizado:', email, '| Tipo:', usuario.tipo);
            console.log(' Token gerado:', token);
            
            // Retornar sucesso
            return res.status(200).json({
                mensagem: "Login realizado com sucesso",
                success: true,
                usuario: {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    telefone: usuario.telefone,
                    tipo: usuario.tipo
                },
                token: token
            });
            
        } catch (error) {
            console.error(' Erro no login:', error);
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
            // Verificar se email já existe
            const existe = db.prepare('SELECT id FROM usuarios WHERE email = ?').get(email);
            if (existe) {
                return res.status(400).json({
                    erro: "Este e-mail já está cadastrado"
                });
            }
            
            // Inserir usuário (senha em texto puro por enquanto)
            const stmt = db.prepare(`
                INSERT INTO usuarios (nome, email, senha, telefone, cep, tipo)
                VALUES (?, ?, ?, ?, ?, 'adotante')
            `);
            
            const info = stmt.run(nome, email, senha, telefone || null, cep || null);
            
            console.log('Novo usuário cadastrado:', email);
            
            return res.status(201).json({
                mensagem: "Usuário cadastrado com sucesso",
                success: true,
                usuario: {
                    id: info.lastInsertRowid,
                    nome: nome,
                    email: email,
                    tipo: 'adotante'
                }
            });
            
        } catch (error) {
            console.error('Erro no cadastro:', error);
            return res.status(500).json({
                erro: "Erro interno ao cadastrar usuário"
            });
        }
    }
};

module.exports = authController;