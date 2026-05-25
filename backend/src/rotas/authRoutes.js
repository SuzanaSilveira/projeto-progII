const express = require('express');
const router = express.Router();
const authController = require('../controladores/authController');

router.post('/login', authController.login);
router.post('/register', authController.registrar);

module.exports = router;