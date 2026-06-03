const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadConfig');  // ← mudou de middlewares para middleware
const uploadController = require('../controladores/uploadController');

router.post('/upload', upload.single('imagem'), uploadController.uploadImagem);
router.delete('/upload/:filename', uploadController.deletarImagem);

module.exports = router;