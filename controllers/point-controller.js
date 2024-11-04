require('dotenv').config();
const Point = require('../model/Point');
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
const addPoint = async (req, res, next) => {
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

exports.addPoint = addPoint;
