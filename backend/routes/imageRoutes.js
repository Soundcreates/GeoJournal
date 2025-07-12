const express = require('express');
const imageRouter = express.Router();
const { postImage } = require('../controllers/imageController');
const authController = require('../controllers/authController');

imageRouter.post('/', authMiddleware, postImage);

module.exports = imageRouter;