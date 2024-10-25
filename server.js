const express = require('express');
const app = express();
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const PORT = process.env.PORT || 3500;

//設定可使用此api的名單
const whitelist = ['http://127.0.0.1:5500',];
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS!'));
        }
    },
    optionsSuccessStatus: 200
}

// Cross origin resources sharing
app.use(cors());

//有錯誤時回傳error
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));