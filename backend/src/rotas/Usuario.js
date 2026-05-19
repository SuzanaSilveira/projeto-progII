const express = require('express');
const router = express.Router();
const usuarioController = require('../controladores/usuarioController');

/**
 * @swagger
 * /api/usuarios/cadastro:
 *   post:
 *     summary: Cadastrar usuário
 *     responses:
 *       201:
 *         description: Usuário cadastrado
 */
router.post('/cadastro', usuarioController.cadastrar);

/**
 * @swagger
 * /api/usuarios/login:
 *   post:
 *     summary: Realizar login
 *     responses:
 *       200:
 *         description: Login realizado
 */
router.post('/login', usuarioController.login);

/**
 * @swagger
 * /api/usuarios/buscar-cep:
 *   post:
 *     summary: Buscar CEP
 *     responses:
 *       200:
 *         description: CEP encontrado
 */
router.post('/buscar-cep', usuarioController.buscarCep);

<<<<<<< HEAD
// Rotas que precisam de autenticação
=======
/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Buscar usuário por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário encontrado
 */
>>>>>>> e28b37d8f03d24924f829b6d4912b863dc29056b
router.get('/:id', usuarioController.buscarPorId);

module.exports = router;