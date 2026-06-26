// backend/src/rotas/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controladores/adminController');
const adminMiddleware = require('../middleware/adminMiddleware');

// Todas as rotas de admin são protegidas pelo middleware
router.use(adminMiddleware);

// ===== ANIMAIS  =====
router.get('/animais', adminController.listarTodosAnimais);
router.get('/animais/:id', adminController.buscarAnimalPorId);
router.post('/animais', adminController.criarAnimal);
router.put('/animais/:id', adminController.atualizarAnimal);
router.delete('/animais/:id', adminController.deletarAnimal);

// ===== CONTATOS  =====
router.get('/contatos', adminController.listarTodosContatos);
router.patch('/contatos/:id/status', adminController.atualizarStatusContato);

module.exports = router;