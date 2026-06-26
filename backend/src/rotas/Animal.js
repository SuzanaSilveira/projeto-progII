const express = require('express');
const router = express.Router();
const animalController = require('../controladores/animalController');

/**
 * @swagger
 * /api/animais/disponiveis:
 *   get:
 *     summary: Lista animais disponíveis para adoção
 *     responses:
 *       200:
 *         description: Lista de animais disponíveis
 */
router.get('/disponiveis', animalController.listarDisponiveis);

/**
 * @swagger
 * /api/animais/{id}:
 *   get:
 *     summary: Buscar animal por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Animal encontrado
 */
router.get('/:id', animalController.buscarPorId);

/**
 * @swagger
 * /api/animais/{id}/contato:
 *   post:
 *     summary: Registrar interesse em adotar um animal
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Interesse registrado com sucesso
 */
router.post('/:id/contato', animalController.registrarContato);

module.exports = router;