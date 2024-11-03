const express = require('express');
const multer = require('multer');
const auth = require('../../middleware/auth');
const router = express.Router();
const imageControllers = require("../../controllers/images-controller");
const config = require('config');


const multerStorage = multer.memoryStorage();  // Store the file in memory

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error("不支援的檔案類型(只支援jpg、jpeg、png)");
    error.code = "LIMIT_FILE_TYPES";
    return cb(error, false);
  }
  cb(null, true);
};


const upload = multer({ 
  storage: multerStorage,
  fileFilter: fileFilter,
  limits:{
    fileSize: config.get("fileMaxSize")
  } 
});

// Image upload route
router.post('/upload', auth, upload.single('image'), imageControllers.uploadImage, imageControllers.uploadErrorHandler);


module.exports = router;
