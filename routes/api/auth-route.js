const express = require('express');
const router = express.Router();
const authControllers = require('../../controllers/auth-controller');

//使用者登入, POST /api/auth/login
router.post('/login', authControllers.login);

//使用者註冊, POST /api/auth/register
router.post('/register', authControllers.registerUser);

module.exports = router;