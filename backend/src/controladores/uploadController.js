const path = require('path');
const fs = require('fs');

const uploadController = {
    // Upload de imagem
    uploadImagem(req, res) {
        if (!req.file) {
            return res.status(400).json({
                erro: "Nenhuma imagem enviada"
            });
        }

        // Retornar a URL completa da imagem
        const imagemUrl = `/uploads/${req.file.filename}`;

        return res.status(200).json({
            mensagem: "Imagem enviada com sucesso",
            arquivo: req.file.filename,
            caminho: imagemUrl,
            url: `http://localhost:3000${imagemUrl}`
        });
    },

    // Deletar imagem (opcional)
    deletarImagem(req, res) {
        const { filename } = req.params;
        const filePath = path.join(__dirname, '../../uploads', filename);

        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                return res.status(200).json({
                    mensagem: "Imagem deletada com sucesso"
                });
            } else {
                return res.status(404).json({
                    erro: "Imagem não encontrada"
                });
            }
        } catch (error) {
            return res.status(500).json({
                erro: "Erro ao deletar imagem"
            });
        }
    }
};

module.exports = uploadController;