const express = require('express');
const router = express.Router();
const solicitacaoController = require('../controladores/solicitacaoController');

// Rotas de solicitações
router.post('/solicitar', solicitacaoController.solicitar);
router.get('/todas', solicitacaoController.listarTodas);
router.get('/status/:status', solicitacaoController.listarPorStatus);
router.get('/adotante/:adotante_id', solicitacaoController.listarPorAdotante);
router.get('/doador/:doador_id', solicitacaoController.listarPorDoador);
router.get('/:id', solicitacaoController.buscarPorId);
router.put('/:id/status', solicitacaoController.atualizarStatus);
router.delete('/:id', solicitacaoController.deletar);
router.get('/contagem/status', solicitacaoController.contarPorStatus);

module.exports = router;