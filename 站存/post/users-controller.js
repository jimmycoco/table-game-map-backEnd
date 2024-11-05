const HttpError = require('../models/http-error');
const User = require('../models/User'); 
const Post = require('../models/Post'); 

// 1. GET /api/users/:userId/profile
exports.getUserProfile = async (req, res,next) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if (!user) {
            return next(new HttpError('User not found', 404)); 
        }

        // 取得使用者資料，但不返回密碼
        const userProfile = {
            name: user.name,
            username: user.username,
        };

        res.json(userProfile);
    } catch (error) {
        next(new HttpError('Server error', 500));
    }
};

// 2. PUT /api/users/:userId/profile
exports.updateUserProfile = async (req, res,next) => {
    try {
        const userId = req.params.userId;
        const { name, password } = req.body;
        const updatedData = {
            ...(name && { name}),
            ...(password && { password }),
        };

        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });

        if (!updatedUser) {
            return next(new HttpError('User not found', 404)); 
        }

        const updatedProfile = {
            name: updatedUser.name,
            username:updatedUser.username,
        };

        res.json(updatedProfile);
        
    } catch (error) {
        next(new HttpError('Server error', 500));
    }
};

// 3. GET /api/users/:userId/posts
exports.getUserPosts = async (req, res,next) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);

        if (!user) {
            return next(new HttpError('User not found', 404)); 
        }

        const posts = await Post.find({ author: userId }).populate('author', 'fullName profileImage _id');

        res.json(posts);

    } catch (err) {
        next(new HttpError('Server error', 500));
    }
};