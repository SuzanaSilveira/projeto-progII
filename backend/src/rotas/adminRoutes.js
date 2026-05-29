// backend/src/rotas/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controladores/adminController');
const adminMiddleware = require('../middleware/adminMiddleware');

// Todas as rotas de admin são protegidas pelo middleware
router.use(adminMiddleware);

// ===== ANIMAIS =====
router.get('/animais', adminController.listarTodosAnimais);           // GET /api/admin/animais
router.post('/animais', adminController.criarAnimal);                 // POST /api/admin/animais
router.put('/animais/:id', adminController.atualizarAnimal);          // PUT /api/admin/animais/:id
router.delete('/animais/:id', adminController.deletarAnimal);         // DELETE /api/admin/animais/:id

// ===== SOLICITAÇÕES =====
router.get('/solicitacoes', adminController.listarTodasSolicitacoes); // GET /api/admin/solicitacoes
router.get('/solicitacoes/status/:status', adminController.listarSolicitacoesPorStatus); // GET /api/admin/solicitacoes/status/pendente
router.put('/solicitacoes/:id/status', adminController.atualizarStatusSolicitacao); // PUT /api/admin/solicitacoes/:id/status

// ===== DASHBOARD =====
router.get('/dashboard/animais/count', adminController.contarAnimaisPorStatus); // GET /api/admin/dashboard/animais/count
router.get('/dashboard/solicitacoes/count', adminController.contarSolicitacoesPorStatus); // GET /api/admin/dashboard/solicitacoes/count

module.exports = router;