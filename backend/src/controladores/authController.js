const { Usuario, EmailJaCadastradoError, CredenciaisInvalidasError } = require('../entidades/Usuario');

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
            const usuario = Usuario.login(email, senha);
            const token = usuario.gerarToken();

            console.log(' Login realizado:', email, '| Tipo:', usuario.tipo);
            console.log(' Token gerado:', token);

            return res.status(200).json({
                mensagem: "Login realizado com sucesso",
                success: true,
                usuario: usuario.toPublicJSON(),
                token: token
            });

        } catch (error) {
            if (error instanceof CredenciaisInvalidasError) {
                console.log(' Credenciais inválidas para:', email);
                return res.status(error.statusCode).json({ erro: error.message });
            }

            console.error(' Erro no login:', error);
            return res.status(500).json({
                erro: "Erro interno ao fazer login"
            });
        }
    },

    // Registrar novo usuário
    registrar(req, res) {
        const { nome, email, senha, telefone } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({
                erro: "Nome, email e senha são obrigatórios"
            });
        }

        try {
            const novoUsuario = new Usuario(null, nome, email, senha, telefone, 'adotante');
            novoUsuario.cadastrar();

            console.log('Novo usuário cadastrado:', email);

            return res.status(201).json({
                mensagem: "Usuário cadastrado com sucesso",
                success: true,
                usuario: novoUsuario.toPublicJSON()
            });

        } catch (error) {
            if (error instanceof EmailJaCadastradoError) {
                return res.status(error.statusCode).json({ erro: error.message });
            }

            console.error('Erro no cadastro:', error);
            return res.status(500).json({
                erro: "Erro interno ao cadastrar usuário"
            });
        }
    }
};

module.exports = authController;