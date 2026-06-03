const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadConfig');
const uploadController = require('../controladores/uploadController');


router.post('/upload', upload.single('imagem'), uploadController.uploadImagem);

// Rota para deletar imagem
router.delete('/upload/:filename', uploadController.deletarImagem);

module.exports = router;