const express = require('express');
const router = express.Router();
const animalController = require('../controladores/animalController');

/**
 * @swagger
 * /api/animais:
 *   get:
 *     summary: Lista todos os animais
 *     responses:
 *       200:
 *         description: Lista de animais
 */
router.get('/', animalController.listarTodos);

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
 * /api/animais/buscar/por-especie/{especie}:
 *   get:
 *     summary: Buscar animais por espécie
 *     parameters:
 *       - in: path
 *         name: especie
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de animais encontrados
 */
router.get('/buscar/por-especie/:especie', animalController.buscarPorEspecie);

/**
 * @swagger
 * /api/animais/buscar/por-porte/{porte}:
 *   get:
 *     summary: Buscar animais por porte
 *     parameters:
 *       - in: path
 *         name: porte
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de animais encontrados
 */
router.get('/buscar/por-porte/:porte', animalController.buscarPorPorte);

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
/**
 * @swagger
 * /api/animais/admin/{administrador_id}:
 *   get:
 *     summary: Lista os animais cadastrados por um administrador
 *     parameters:
 *       - in: path
 *         name: administrador_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de animais do administrador
 */
router.get('/admin/:administrador_id', animalController.buscarPorAdministrador);
router.get('/buscar/por-porte/:porte', animalController.buscarPorPorte);
router.get('/:id', animalController.buscarPorId);

/**
 * @swagger
 * /api/animais:
 *   post:
 *     summary: Cadastrar animal
 *     responses:
 *       201:
 *         description: Animal cadastrado
 */
router.post('/', animalController.cadastrar);

/**
 * @swagger
 * /api/animais/{id}:
 *   put:
 *     summary: Atualizar animal
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Animal atualizado
 */
router.put('/:id', animalController.atualizar);

/**
 * @swagger
 * /api/animais/{id}:
 *   delete:
 *     summary: Deletar animal
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Animal removido
 */
router.delete('/:id', animalController.deletar);

module.exports = router;