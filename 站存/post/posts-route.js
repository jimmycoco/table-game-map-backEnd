const express = require("express");
const router = express.Router();
const postControllers = require("../../controllers/posts-controller");
const auth = require("../../middleware/auth");


router.post("/", auth, postControllers.createPost);


router.get("/post", postControllers.getAllPost);


router.get("/byTag", auth,postControllers.getPostsByTag);


router.get("/:postId", postControllers.getPost);


router.put("/:postId", auth, postControllers.updatePost);


router.delete("/:postId", auth, postControllers.deletePost);


module.exports = router;
