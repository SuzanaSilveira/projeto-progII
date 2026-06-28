const { Usuario, UsuarioNaoEncontradoError } = require('../entidades/Usuario');

const adminMiddleware = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ erro: "Token não fornecido. Faça login." });
    }

    try {
        const decoded = Buffer.from(token, 'base64').toString();
        const [userId, userEmail] = decoded.split(':');

        if (!userId || !userEmail) {
            return res.status(401).json({ erro: "Token inválido" });
        }

        let usuario;
        try {
            usuario = Usuario.buscarPorId(userId);
        } catch (error) {
            if (error instanceof UsuarioNaoEncontradoError) {
                return res.status(401).json({ erro: "Usuário não encontrado" });
            }
            throw error;
        }

        // Confere se o e-mail do token bate com o do usuário encontrado
        if (usuario.email !== userEmail) {
            return res.status(401).json({ erro: "Token inválido" });
        }

        if (!usuario.isAdmin()) {
            return res.status(403).json({ erro: "Acesso negado. Área restrita para administradores." });
        }

        req.usuario = { id: usuario.id, tipo: usuario.tipo };
        next();
    } catch (error) {
        return res.status(401).json({ erro: "Token inválido" });
    }
};

module.exports = adminMiddleware;