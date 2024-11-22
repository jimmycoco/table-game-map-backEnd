const config = require('config'); //引入剛剛設定的秘鑰位置
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const HttpError = require('../models/http-error');
const axios = require('axios'); 
const CLIENT_ID=process.env.CLIENT_ID;
const CLIENT_SECRET=process.env.CLIENT_SECRET;
const qs = require('qs');


const login = async (req, res, next) => {

    // 定義驗證規則
    const validationChains = [
        // 檢查'username'欄位是否存在
        check('username', '帳號為必塡欄位').exists(),
        // 檢查'password'欄位是否存在
        check('password', '密碼為必填欄位').exists()
    ];

    // 執行上述的所有驗證規則
    await Promise.all(validationChains.map(validation => validation.run(req)));

    // 取得驗證結果
    const errors = validationResult(req);

    // 如果驗證結果有錯誤，則拋出400的HttpError
    if (!errors.isEmpty()) {
        return next(new HttpError('驗證錯誤，請檢查輸入資料', 400));
    }

    const { username, password } = req.body;

    try {
        // 驗證使用者是否存在
        let user = await User.findOne({ username });

        // 若使用者不存在，則拋出Error
        if (!user) {
            return next(new HttpError('無效的資料，請檢查帳號密碼是否正確', 400));
        }

        // 驗證密碼是否匹配
        const isMatch = await bcrypt.compare(password, user.password);

        // 若密碼不匹配，則拋出400的HttpError
        if (!isMatch) {
            return next(new HttpError('無效的資料，請檢查帳號密碼是否正確', 400));
        }

        // 建立要用於jsonwebtoken的資料模型
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        }

        // 生成jsonwebtoken
        jwt.sign(
            payload,
            config.get('jwtSecret'), //取得秘鑰
            { expiresIn: '12h' }, //設定token失效時間
            (err, token) => {
                if (err) throw err;
                // 將token回傳給客戶端
                res.json({
                    token: token,
                    id: user._id,
                    name: user.name,
                });
            }
        )

    } catch (err) {
        if (!(err instanceof HttpError)) {
            console.error(err.message);
            err = new HttpError('Server error', 500);
        }
        next(err);
    }
}

const registerUser = async (req, res, next) => {

    console.log(req.body)
    // 驗證規則設定
    const validationChains = [
        check('name', '使用者名稱為必填欄位').not().isEmpty(),
        check('username', '帳號為必塡欄位').exists(),
        check('password', '請輸入8個字元以上的密碼').isLength({ min: 6 })
    ];

    // 執行所有的驗證規則
    await Promise.all(validationChains.map(validation => validation.run(req)));

    try {
        const errors = validationResult(req);

        // 若驗證錯誤，回傳錯誤
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                message: '註冊失敗',
                errors: errors.array()  // 這裡會回傳一個包含所有驗證錯誤的陣列
            });
        }


        const { name, username, password } = req.body;

        // 檢查該使用者帳號是否已存在於資料庫中
        let user = await User.findOne({ username });
        if (user) {
            return next(new HttpError('User already exists.', 400));
        }

        user = new User({
            name,
            username,
            password
        });

        // 使用bcrypt對密碼進行加密
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // 儲存新的使用者資訊至資料庫
        await user.save();

        //回傳註冊成功訊息
        res.status(200).json({ message: '註冊成功' })

    } catch (err) {
        // 根據錯誤的類型來決定如何處理
        if (err instanceof HttpError) {
            next(err);
        } else {
            console.error(err.message);
            next(new HttpError('Server error', 500));
        }
    }
};


// LINE 登入驗證
const lineLogin = async (req, res ,next) => {
    const { code } = req.query;
    if (!code) {
        return next(new HttpError('無效的 LINE 登入請求', 400));
    }

    try {
    

        const response = await axios.post('https://api.line.me/oauth2/v2.1/token', qs.stringify({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: 'http://localhost:3500/api/auth/lineLogin',
            client_id: '2006566313',
            client_secret: '9f9656e8a171adb9cb5d9624cd3380a1'
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });


            const { access_token } = response.data;
            const profileResponse = await axios.get('https://api.line.me/v2/profile', {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            });
    
        const { displayName, userId } = profileResponse.data;
        let user = await User.findOne({ name: displayName });
    
        
        if (!user) {
            user = new User({
                name: displayName,
                lineId: userId,
                joinDate: new Date()
            });
            await user.save();
        }

        res.json({
            message: 'LINE 登入成功',
            user: {
                name: user.name,
                username: user.username,
                joinDate: user.joinDate
            }
        });

    } catch (error) {
        console.error('LINE 登入錯誤:', error.response?.data || error.message);
        next(new HttpError('LINE 登入失敗', 500));
    }
};

exports.login = login;
exports.lineLogin=lineLogin;
exports.registerUser = registerUser;