const config = require('config');
const path = require('path');
const keyFilePath = path.join(__dirname, '../keys.json');
const HttpError = require('../models/http-error');
const {Storage} = require('@google-cloud/storage');

exports.uploadErrorHandler = (err, req, res, next) => {
    if (err.code === "LIMIT_FILE_TYPES") {
        res.status(422).json({ error: "Only Images are Allowed" });
        return;
    }
    if (err.code === "LIMIT_FILE_SIZE") {
        res.status(422).json({ error: `Size is too Large, Max size is ${config.get('fileMaxSize') / 1000000}MB` });
        return;
    }
    next(err);
};

exports.uploadImage =  (req, res,next) => {

    if (!req.file) {
        return next(new HttpError('No file uploaded', 400));
    }
    const storage = new Storage({
        keyFilename: keyFilePath,
        projectId: 'blog-platform-402208',
     });

    const bucket = storage.bucket('blog-platform');
    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream();

    blobStream.on('error', (err) => {
        res.status(500).send(err);
     });

     blobStream.on('finish', () => {
        // The image URL to access the file in GCS
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        res.status(200).json({ success: true, data: { url: publicUrl } });
     });
  
    blobStream.end(req.file.buffer);
};