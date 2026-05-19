// authController.js

const authController = {
    
    // Realizar login
    login(req, res) {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                erro: "Email e senha são obrigatórios"
            });
        }

        // Aqui futuramente será feita validação no banco
        return res.status(200).json({
            mensagem: "Login realizado com sucesso",
            usuario: email
        });
    },

    // Realizar cadastro
    registrar(req, res) {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({
                erro: "Todos os campos são obrigatórios"
            });
        }

        return res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso"
        });
    }
};

module.exports = authController;