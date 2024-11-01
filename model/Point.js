const mongoose = require('mongoose');

const PointSchema = new mongoose.Schema({
    //店家名稱
    store: {
        type: String,
        required: true,
    },
    //店家地址
    storeAddress: {
        type: String,
        required: true,
    },
    //店家座標
    storePosition: {
        type: [{ lng: Number, lat: Number }],
        required: true,
    },
    //場地費用
    money: {
        type: String,
        enum: ['daytime', 'hourtime'],
        required: true,
    },
    //是否需要預約
    vip: {
        type: String,
        enum: ['yesvip', 'novip'],
        required: true,
    },
    //是否要訂金
    deposit: {
        type: String,
        enum: ['yesdeposit', 'nodeposit'],
        required: true,
    },
    //是否有員工
    staff: {
        type: String,
        enum: ['yesstaff', 'nostaff'],
        required: true,
    },
    //現場是否有桌遊可以已購買
    buyGame: {
        type: String,
        enum: ['yesbuygame', 'nobuygame'],
        required: true,
    },
    //有無包廂
    vipRoom: {
        type: String,
        enum: ['yesviproom', 'noviproom'],
        required: true,
    },
    //現場有無提供餐點可以購買
    infood: {
        type: String,
        enum: ['yesinfood', 'noinfood'],
        required: true,
    },
    //營業時間：
    outFood: {
        type: String,
        enum: ['outyesfood', 'outnofood'],
        required: true,
    },
    //營業時間
    storePosition: {
        type: [{
            monday: String,
            tuesday: String,
            wednesday: String,
            thursday: String,
            friday: String,
            saturday: String,
            sunday: String
        }],
        required: true,
    },
    //是否過審
    ischeck: {
        type: Boolean,
        default: false,
    },
    //申請日期
    joinDate: {
        type: Date,
        default: Date.now,
    }
});

module.exports = Point = mongoose.model('point', PointSchema);