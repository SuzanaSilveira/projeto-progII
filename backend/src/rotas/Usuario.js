const express = require('express');
const router = express.Router();
const usuarioController = require('../controladores/usuarioController');

// Rotas públicas
router.post('/cadastro', usuarioController.cadastrar);
router.post('/login', usuarioController.login);
router.post('/buscar-cep', usuarioController.buscarCep);

// Rotas que precisam de autenticação
router.get('/:id', usuarioController.buscarPorId);
router.put('/:id', usuarioController.atualizar);
router.delete('/:id', usuarioController.deletar);
router.post('/:id/preferencias', usuarioController.definirPreferencias);
router.get('/:id/preferencias', usuarioController.buscarPreferencias);

module.exports = router;
