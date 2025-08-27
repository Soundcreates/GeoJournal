const User = require("../models/userModel");
const journalModel = require("../models/journalModel");

module.exports.sendRequest = async (req, res) => {
  const userId = req.user.id;
  const targetId = req.params.id;

  try {
    const targetUser = await User.findById(targetId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }
    if (userId === targetId)
      return res
        .status(400)
        .json({ message: "You cannot send a friend request to yourself" });
    const alreadySent = currentUser.requestsSent.includes(targetId);
    if (alreadySent) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    const alreadyReceived = currentUser.requestsReceived.includes(targetId);
    if (alreadyReceived) {
      currentUser.friends.push(targetId);
      targetUser.friends.push(userId);
      currentUser.requestsReceived = currentUser.requestsReceived.filter(
        (requestId) => requestId.toString() !== targetId
      );
      targetUser.requestsSent = targetUser.requestsSent.filter(
        (requestId) => requestId.toString() !== userId
      );
      await currentUser.save();
      await targetUser.save();
      return res
        .status(200)
        .json({ message: "Friend request accepted", user: currentUser });
    }

    // Check if they're already friends
    const alreadyFriends = currentUser.friends.includes(targetId);
    if (alreadyFriends) {
      return res
        .status(400)
        .json({ message: "You are already friends with this user" });
    }

    currentUser.requestsSent.push(targetId);
    await currentUser.save();
    targetUser.requestsReceived.push(userId);
    await targetUser.save();
    return res
      .status(200)
      .json({ message: "Friend request sent", user: currentUser });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.acceptRequest = async (req, res) => {
  const userId = req.user.id;
  const senderId = req.params.id;

  try {
    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({ message: "User not found" });
    }
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const requestIndex = currentUser.requestsReceived.findIndex(
      (id) => id.toString() === senderId
    );
    if (requestIndex === -1) {
      return res
        .status(400)
        .json({ message: "No friend request from this user" });
    }

    // Add to friends lists
    currentUser.friends.push(senderId);
    sender.friends.push(userId);

    // Remove from requests lists
    currentUser.requestsReceived.splice(requestIndex, 1);
    sender.requestsSent = sender.requestsSent.filter(
      (id) => id.toString() !== userId
    );

    await currentUser.save();
    await sender.save();
    return res
      .status(200)
      .json({ message: "Friend request accepted", user: currentUser });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.rejectRequest = async (req, res) => {
  const userId = req.user.id;
  const senderId = req.params.id;
  try {
    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const requestIndex = currentUser.requestsReceived.findIndex(
      (id) => id.toString() === senderId
    );
    if (requestIndex === -1) {
      return res
        .status(400)
        .json({ message: "No friend request from this user" });
    }
    currentUser.requestsReceived.splice(requestIndex, 1);
    sender.requestsSent = sender.requestsSent.filter(
      (id) => id.toString() !== userId
    );
    await currentUser.save();
    await sender.save();
    return res
      .status(200)
      .json({ message: "Friend request rejected", user: currentUser });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.removeFriend = async (req, res) => {
  const userId = req.user.id;
  const friendId = req.params.id;
  try {
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(404).json({ message: "User not found" });
    }

    const friendIndex = currentUser.friends.findIndex(
      (id) => id.toString() === friendId
    );
    if (friendIndex === -1) {
      return res.status(400).json({ message: "This user is not your friend" });
    }
    currentUser.friends.splice(friendIndex, 1);

    const userIndexInFriend = friend.friends.findIndex(
      (id) => id.toString() === userId
    );
    if (userIndexInFriend !== -1) {
      friend.friends.splice(userIndexInFriend, 1);
    }

    await currentUser.save();
    await friend.save();
    return res
      .status(200)
      .json({ message: "Friend removed successfully", user: currentUser });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getFriends = async (req, res) => {
  const userID = req.user.id;
  try {
    const currentUser = await User.findById(userID).populate(
      "friends",
      "username"
    );
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }
    if (currentUser.friends.length === 0) {
      return res.status(200).json({ message: "You have no friends yet" });
    }

    return res.status(200).json({ friends: currentUser.friends });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getFriendRequests = async (req, res) => {
  const userId = req.user.id;
  try {
    const currentUser = await User.findById(userId)
      .populate("requestsReceived", "username")
      .populate("requestsSent", "username");
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }
    if (
      currentUser.requestsReceived.length === 0 &&
      currentUser.requestsSent.length === 0
    ) {
      return res
        .status(200)
        .json({ message: "You have no friend requests yet" });
    }

    return res.status(200).json({
      requestsReceived: currentUser.requestsReceived,
      requestsSent: currentUser.requestsSent,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.fetchLikes = async (req, res) => {
  const journalId = req.params.journalId;
  const userId = req.user.id;

  try {
    if (!journalId) {
      console.error("Journal ID is invalid");
      return res.status(400).json({ message: "Journal ID is required" });
    }

    // Fetch user & journal with only required fields
    const user = await User.findById(userId).select("likedPosts");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const journal = await journalModel.findById(journalId).select("likes");
    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    // Check if the user has liked the journal
    const alreadyLiked = user.likedPosts.includes(journalId);

    return res.status(200).json({
      status: alreadyLiked, // true if user liked it
      likesCount: journal.likes.length, // actual like count
      journalId,
    });
  } catch (err) {
    console.error("Error fetching likes:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getUsers = async (req, res) => {
  const userId = req.user.id;

  try {
    console.log("Fetching users from database...");
    const users = await User.find({
      _id: { $ne: userId },
    }).select("-password -email -googleId");
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "User not found" });
      console.log("User not found");
    }
    return res.status(200).json({ users });
  } catch (err) {
    console.error("Error fetching likes:", err.message);
  }
};

module.exports.getSpecificUser = async (req, res) => {
  const userId = req.params.userId;
  console.log("Fetching user: ", userId);
  try {
    const user = await User.findById(userId).select(
      "-password -email -googleId"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (err) {
    console.error("Error fetching user:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.followUnfollowUser = async (req, res) => {
  const userId = req.user.id;
  const targetUserId = req.params.userId;
  console.log("followUnfollow endpoint hit!");
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log("Error at followunfollow controller, user not found");
    }
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      console.log("Error at followUnfollow controller, target user not found");
    }
    if (targetUser.followers.includes(userId.toString())) {
      //unfollow the user
      targetUser.followers = targetUser.followers.filter((id) => id != userId);
      user.following = user.following.filter((id) => id != targetUserId);
      await targetUser.save();
      await user.save();
      console.log("Unfollowed the target user: ", targetUser.username);
      return res
        .status(200)
        .json({ message: "Unfollowed successfully", status: false });
    }

    //if not already following, follow
    targetUser.followers.push(userId);
    user.following.push(targetUserId);
    await targetUser.save();
    await user.save();
    console.log("Followed the target user: ", targetUser.username);

    return res.status(200).json({
      status: true,
    });
  } catch (err) {
    console.log("Error at followUnfollow controller:", err.message);
  }
};

module.exports.fetchFollowStatus = async (req, res) => {
  const userId = req.user.id;
  const targetUserId = req.params.userId;
  console.log("fetchfollowstatus endpoint hit!");
  try {
    const user = await User.findById(userId);
    if (!user)
      console.log("Error at fetchFollowStatus controller, user not found");
    const targetUser = await User.findById(targetUserId);
    if (!targetUser)
      console.log(
        "Error at fetchFollowStatus controller, target user not found"
      );
    return res.status(200).json({
      status: targetUser.followers.includes(userId) ? true : false,
      targetUser: {
        followersCount: targetUser.followers.length,
        followingCount: targetUser.following.length,
      },
      user: {
        followersCount: user.followers.length,
        followingCount: user.following.length,
      },
    });
  } catch (err) {
    console.log("Error at fetchFollowStatus controller:", err.message);
  }
};

module.exports.getGeoCode = async (req, res) => {
  const place = req.params.place;
  console.log("calling nominatim api");
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${place}`;
    const response = await fetch(url);

    const data = await response.json();

    if (data && data.length > 0) {
      return res.status(200).json({
        latitude: data[0].lat,
        longitude: data[0].lon,
      });
    }
  } catch (err) {
    console.error("Error fetching geocode:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
