//this will include friend system
const express = require('express');
const userRouter = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { sendRequest, acceptRequest, rejectRequest, removeFriend, getFriends, getFriendRequests } = require('../controllers/userController');

userRouter.post('/send-request/:id', authMiddleware, sendRequest);
userRouter.post('/accept-request', authMiddleware, acceptRequest);
userRouter.post('/reject-request', authMiddleware, rejectRequest);
userRouter.post('/remove-friend/:id', authMiddleware, removeFriend);
userRouter.get('/friends', authMiddleware, getFriendsList);
userRouter.get('/requests', authMiddleware, getFriendRequests);