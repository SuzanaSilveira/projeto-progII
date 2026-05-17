const express = require('express');
const router = express.Router();
const animalController = require('../controladores/animalController');

// Rotas públicas
router.get('/', animalController.listarTodos);
router.get('/disponiveis', animalController.listarDisponiveis);
router.get('/:id', animalController.buscarPorId);
router.get('/buscar/por-especie/:especie', animalController.buscarPorEspecie);
router.get('/buscar/por-porte/:porte', animalController.buscarPorPorte);
router.post('/buscar/preferencias', animalController.buscarPorPreferencias);

// Rotas de administrador
router.post('/', animalController.cadastrar);
router.put('/:id', animalController.atualizar);
router.delete('/:id', animalController.deletar);
router.patch('/:id/status', animalController.atualizarStatus);

// Rota de contato
router.post('/:id/contato', animalController.enviarContato);

module.exports = router;
