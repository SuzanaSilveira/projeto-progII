// backend/src/rotas/publicRoutes.js
const express = require('express');
const router = express.Router();
const animalController = require('../controladores/animalController');

// Listar animais disponíveis (público)
router.get('/disponiveis', animalController.listarDisponiveis);

// Buscar animal por ID (público)
router.get('/:id', animalController.buscarPorId);

// Registrar interesse (precisa estar logado, mas é público)
router.post('/:id/contato', animalController.registrarContato);

module.exports = router;