const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  coverImage: {
    type: String, 
    required: true 
  },
  tags: {
    type: Array,
    required: true
  },
  content: { 
    type: String, 
    required: true 
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true 
  },
});

module.exports = Post = mongoose.model('Post', PostSchema);
