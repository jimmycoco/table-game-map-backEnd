const express = require('express');
const router = express.Router();
const authControllers = require('../../controllers/auth-controller');

//使用者登入
router.post('/login', authControllers.login);

//使用者註冊
router.post('/register', authControllers.registerUser);

module.exports = router;