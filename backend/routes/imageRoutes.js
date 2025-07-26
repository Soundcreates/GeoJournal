const express = require('express');
const imageRouter = express.Router();
const { postImage } = require('../controllers/imageController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const cloudinary = require('../utils/cloudinary');

const storage = multer.memoryStorage();
const upload = multer({ storage });

imageRouter.post('/upload', upload.single('image'), authMiddleware, postImage);

module.exports = imageRouter;