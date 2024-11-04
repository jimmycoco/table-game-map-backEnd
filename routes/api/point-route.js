const express = require('express');
const router = express.Router();
const pointControllers = require('../../controllers/point-controller');

//儲存申請表單
router.post('/addPoint', pointControllers.addPoint);

//取得地圖標點資料
router.get('/getPointsForMap', pointControllers.getPointsForMap);

//取得指定標點的資料
router.get('/getPointDetails', pointControllers.getPointDetails);


module.exports = router;