const express = require('express');
const authRouter = express.Router();
const { registerController, loginController, logoutController, me } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');


authRouter.post('/register', registerController);
authRouter.post('/login', loginController);
//logout will be handled on the frontend, so no need for a logout route
authRouter.get('/me', authMiddleware, me);

module.exports = authRouter;