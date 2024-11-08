const express = require('express');
const router = express.Router();
const postController = require('../../controllers/post-controller');
const auth = require("../../middleware/auth");

//新增文章, POST /api/post
router.post("/", postController.createPost);

//取得文章, GET /api/post/:postId
router.get("/:postId", postController.getPost);

//更新文章, PUT /api/post/:postId
router.put("/:postId", postController.updatePost);

//刪除文章, DELETE /api/post/:postId
router.delete("/:postId", postController.deletePost);

//取得所有文章 GET /api/post
router.get("/", auth, postController.getAllPost);

//取得所有文章(依照標籤分類) GET /api/post/byTag
router.get("/byTag", auth, postController.getPostsByTag);

module.exports = router;

