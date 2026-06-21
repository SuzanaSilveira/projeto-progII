const path = require('path');
const fs = require('fs');

const uploadController = {
    // Upload de imagem
    uploadImagem(req, res) {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                erro: "Nenhuma imagem enviada"
            });
        }

        // Caminho relativo da imagem
        const imagemUrl = `/uploads/${req.file.filename}`;

        return res.status(200).json({
            success: true,
            mensagem: "Imagem enviada com sucesso",
            arquivo: req.file.filename,
            imagem_url: imagemUrl
        });
    },

    // Deletar imagem
    deletarImagem(req, res) {
        const { filename } = req.params;
        const filePath = path.join(__dirname, '../../uploads', filename);

        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);

                return res.status(200).json({
                    success: true,
                    mensagem: "Imagem deletada com sucesso"
                });
            }

            return res.status(404).json({
                success: false,
                erro: "Imagem não encontrada"
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                erro: "Erro ao deletar imagem"
            });
        }
    }
};

module.exports = uploadController;