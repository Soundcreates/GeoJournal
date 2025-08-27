//this will include friend system
const express = require("express");
const userRouter = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getGeoCode,
  followUnfollowUser,
  fetchFollowStatus,
  getSpecificUser,
  getUsers,
  fetchLikes,
  sendRequest,
  acceptRequest,
  rejectRequest,
  removeFriend,
  getFriends,
  getFriendRequests,
} = require("../controllers/userController");

// app.use('/api/users', userRouter); //base route

userRouter.post("/send-request/:id", authMiddleware, sendRequest);
userRouter.post("/accept-request/:id", authMiddleware, acceptRequest);
userRouter.post("/reject-request/:id", authMiddleware, rejectRequest);
userRouter.post("/remove-friend/:id", authMiddleware, removeFriend);
userRouter.get("/friends", authMiddleware, getFriends);
userRouter.get("/requests", authMiddleware, getFriendRequests);

userRouter.get("/getOtherUsers", authMiddleware, getUsers);
userRouter.get("/getSpecificUser/:userId", authMiddleware, getSpecificUser);

//follow-unfollow routes
userRouter.post("/followUnfollow/:userId", authMiddleware, followUnfollowUser);
userRouter.get("/fetchFollowStatus/:userId", authMiddleware, fetchFollowStatus);

userRouter.get("/fetchLikes/:journalId", authMiddleware, fetchLikes);

//geocode routee
userRouter.get("/geocode/:place", getGeoCode);
module.exports = userRouter;
