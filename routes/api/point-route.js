const express = require('express');
const router = express.Router();
const pointControllers = require('../../controllers/point-controller');

//儲存申請表單
router.post('/addpoint', pointControllers.addPoint);

//取得地圖標點資料

module.exports = router;