const express = require('express');
const app = express();
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const postRoutes = require('./routes/api/post-route');
const connectDB = require('./config/db');
const PORT = process.env.PORT || 3500;
const authRoutes = require('./routes/api/auth-route');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

//連接到資料庫
connectDB();

// Cross origin resources sharing
app.use(cors(corsOptions));

//引入auth-routes
app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
    //檢查是否已經向客戶端發送了HTTP header，如果已經發送了，表示已經無法再修改狀態碼和header
    if (res.headersSent) {
        return next(err);
    }
    //將錯誤的堆疊訊息（stack trace）輸出到控制台，以方便進行偵錯
    console.error(err.stack);

    res.status(err.status || 500);

    res.json({
        error: {
            message: err.message || 'Internal Server Error'
        }
    });
});



//測試postRoutes
app.use('/api/posts', postRoutes);





app.listen(PORT, () => console.log(`Server running on port ${PORT}`));