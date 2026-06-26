const express = require('express');
const router = express.Router();
const usuarioController = require('../controladores/usuarioController');

/**
 * @swagger
 * /api/usuarios/login:
 *   post:
 *     summary: Cadastrar novo usuario
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 */
router.post('/cadastro', usuarioController.cadastrar);

module.exports = router;