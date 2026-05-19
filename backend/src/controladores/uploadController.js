const path = require('path');

const uploadController = {

    // Upload de imagem
    uploadImagem(req, res) {

        if (!req.file) {
            return res.status(400).json({
                erro: "Nenhuma imagem enviada"
            });
        }

        return res.status(200).json({
            mensagem: "Imagem enviada com sucesso",
            arquivo: req.file.filename,
            caminho: path.join('uploads', req.file.filename)
        });
    }
};

module.exports = uploadController;