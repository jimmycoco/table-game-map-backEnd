require('dotenv').config();
const Point = require('../models/Point');
const axios = require('axios');

// Google Maps Geocoding API Key
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// 使用地址取得經緯度的輔助函式
const getCoordinatesFromAddress = async (address) => {
    try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
            params: {
                address: address,
                key: GOOGLE_MAPS_API_KEY,
            }
        });

        const { results, status, error_message } = response.data;

        if (status !== 'OK') {
            throw new Error(error_message || '無法根據地址取得經緯度');
        }

        if (results.length > 0) {
            const location = results[0].geometry.location;
            return { lng: location.lng, lat: location.lat };
        } else {
            throw new Error('無法根據地址取得經緯度');
        }
    } catch (error) {
        console.error('取得經緯度失敗:', error);
        throw error;
    }
};

// 定義 Express 路由處理函式
const addPoint = async (req, res) => {
    try {
        const formData = req.body;

        // 檢查地址是否已存在
        const existingPoint = await Point.findOne({ storeAddress: formData.storeAddress });
        if (existingPoint) {
            return res.status(400).json({ success: false, message: '此地址已存在，請使用其他地址' });
        }

        // 使用地址取得經緯度
        let coordinates;
        try {
            coordinates = await getCoordinatesFromAddress(formData.storeAddress);
        } catch (error) {
            // 若取得經緯度失敗，立即回傳錯誤訊息並停止儲存
            return res.status(400).json({ success: false, message: '地址轉換失敗', error: error.message });
        }

        // 構建新的 Point 資料物件
        const newPoint = new Point({
            store: formData.store,
            storeAddress: formData.storeAddress,
            storePosition: [coordinates], // 將經緯度加入店家座標
            money: formData.money,
            vip: formData.vip,
            deposit: formData.deposit,
            staff: formData.staff,
            buyGame: formData.buyGame,
            vipRoom: formData.vipRoom,
            infood: formData.infood,
            outFood: formData.outFood,
            hours: formData.hours, // 營業時間
            whoApply: formData.whoApply,
            // joinDate 和 ischeck 會自動使用資料庫的預設值
        });

        // 將資料保存至 MongoDB
        await newPoint.save();

        // 回傳成功的回應
        res.status(201).json({ success: true, message: '資料成功保存' });
    } catch (error) {
        console.error('資料保存失敗:', error);
        // 將錯誤訊息回傳前端
        res.status(500).json({ success: false, message: '資料保存失敗', error: error.message });
    }
};


// 抓取資料庫中符合條件的資料
const getPointsForMap = async (req, res) => {
    try {
        // 查詢已過審的資料
        const approvedPoints = await Point.find({ ischeck: true });

        // 取得需要的資料
        const dataForMap = approvedPoints.map(point => ({
            store: point.store,
            storePosition: point.storePosition
        }));

        // 回傳前端
        res.status(200).json({
            dataForMap
        });
    } catch (error) {
        console.error('抓取資料失敗:', error);
        res.status(500).json({ success: false, message: '無法抓取資料', error: error.message });
    }
};

const getPointDetails = async (req, res) => {
    try {
        const { storePosition } = req.query;

        // 驗證是否提供座標
        if (!storePosition) {
            return res.status(400).json({ success: false, message: '請提供店家座標以查詢' });
        }

        // 解析座標參數
        const [lng, lat] = storePosition.split(',').map(coord => parseFloat(coord.trim()));
        if (isNaN(lng) || isNaN(lat)) {
            return res.status(400).json({ success: false, message: '座標格式錯誤，請使用 "lng,lat" 格式' });
        }

        // 查詢指定的資料
        const approvedPoint = await Point.findOne({
            storePosition: {
                $elemMatch: {
                    lng: lng,
                    lat: lat
                }
            }
        });

        // 如果查無資料，返回 404
        if (!approvedPoint) {
            return res.status(404).json({ success: false, message: '找不到符合條件的資料' });
        }

        // 整理需要的資料，排除 storePosition 和 ischeck
        const { storePosition: _, ischeck: __, ...dataDetails } = approvedPoint.toObject();

        // 回傳前端
        res.status(200).json({
            dataDetails
        });
    } catch (error) {
        console.error('抓取資料失敗:', error);
        res.status(500).json({ success: false, message: '無法抓取資料', error: error.message });
    }
};

module.exports = { addPoint, getPointsForMap, getPointDetails };
