const express = require('express');
const router = express.Router();
const favoritoController = require('../controladores/favoritoController');

router.post('/', favoritoController.adicionar);
router.delete('/:usuario_id/:animal_id', favoritoController.remover);
router.get('/usuario/:usuario_id', favoritoController.listarPorUsuario);
router.get('/verificar/:usuario_id/:animal_id', favoritoController.verificar);

module.exports = router;