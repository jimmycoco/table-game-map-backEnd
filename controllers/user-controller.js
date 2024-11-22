const HttpError = require('../models/http-error');
const User = require('../models/User');




//取得使用者資料
const getUserProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if (!user) {
            return next(new HttpError('查無此使用者', 404));
        }

        // 取得使用者資料
        const userProfile = {
            name: user.name,
            username: user.username,
            joinDate: user.joinDate,
        };

        res.json(userProfile);

    } catch (error) {
        next(new HttpError('Server error', 500));
    }
};

//更新使用者資料
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { name, username } = req.body;
        const updatedData = {
            ...(name && { name }),
            ...(username && { username }),
        };

        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });

        if (!updatedUser) {
            return next(new HttpError('查無此使用者', 404));
        }

        const updatedProfile = {
            name: updatedUser.name,
            username: updatedUser.username,
            joinDate: updatedUser.joinDate,
        };

        res.json(updatedProfile);

    } catch (error) {
        next(new HttpError('Server error', 500));
    }
};


module.exports = { getUserProfile, updateUserProfile };