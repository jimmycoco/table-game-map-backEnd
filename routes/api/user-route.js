const express = require('express');
const router = express.Router();
const userControllers = require('../../controllers/user-controller');
const auth = require("../../middleware/auth");


//取得使用者資訊 GET /api/user/:userId/profile
router.get('/:userId/profile', auth, userControllers.getUserProfile);

//修改使用者資料 PUT /api/user/:userId/profile
router.put('/:userId/profile', auth, userControllers.updateUserProfile);

module.exports = router;