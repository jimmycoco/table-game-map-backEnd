const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    //使用者名稱
    name: {
        type: String,
        required: true
    },
    //帳號名稱，不可與其他人重複
    username: {
        type: String,
        required: true,
        unique: true
    },
    //密碼
    password: {
        type: String,
        required: true
    },
    //註冊日期
    joinDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = User = mongoose.model('user', UserSchema);
