const mongoose = require('mongoose');
//const config = require('config');
require('dotenv').config();
const db = process.env.MONGODB_URI;


const connectDB = async () => {
    try {
        await mongoose.connect(db);
        console.log('MongoDB Connected...');

    } catch (err) {
        console.error(err.message);

        //當失敗的時候立刻離開此程式
        process.exit(1);
    }
}

module.exports = connectDB;