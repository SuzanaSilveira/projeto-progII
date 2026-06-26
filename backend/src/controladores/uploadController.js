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
    }
};

module.exports = uploadController;