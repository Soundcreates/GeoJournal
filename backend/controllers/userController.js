const user = require('../models/userModel');

module.exports.sendRequest = async (req, res) => {
  const userId = req.user.id;
  const id = req.params.id;

  try {
    const sender = await user.findById(id);
    if (!sender) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = await user.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (userId === id) return res.status(400).json({ message: "You cannot send a friend request to yourself" });
    const alreadySent = user.requestsSent.includes(id);
    if (alreadySent) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    const alreadyReceived = user.requestsReceived.includes(id);
    if (alreadyReceived) {
      user.friends.push(id);
      user.requestsReceived = user.requestsReceived.filter(requestId => requestId !== id);
      await user.save();
      return res.status(200).json({ message: "Friend request accepted", user });
    }

    user.requestsSent.push(id);
    await user.save();
    sender.requestsReceived.push(userId);
    await sender.save();
    return res.status(200).json({ message: "Friend request sent", user });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal server error" });
  }

}

module.exports.acceptRequest = async (req, res) => {
  const userId = req.user.id;
  const id = req.params.id;

  try {
    const sender = await user.findById(id);
    if (!sender) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = await user.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const requestIndex = user.requestsReceived.indexOf(id);
    if (requestIndex === -1) {
      return res.status(400).json({ message: "No friend request from this user" });
    }
    user.friends.push(id);
    user.requestsRecieved.splice(requestIndex, 1);
    sender.requestsSent = sender.requestsSent.filter(sent => sent !== userId);
    await user.save();
    await sender.save();
    return res.status(200).json({ message: "Friend request accepted", user });

  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports.rejectRequest = async (req, res) => {
  const userId = req.user.id;
  const id = req.params.id;
  try {
    const sender = await user.findById(id);
    if (!sender) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = await user.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const requestIndex = user.requestsReceived.indexOf(id);
    if (requestIndex === -1) {
      return res.status(400).json({ message: "No friend request from this user" });
    }
    user.requestsReceived.splice(requestIndex, 1);
    sender.requestsSent = sender.requestsSent.filter(sent => sent != userId);
    await user.save();
    await sender.save();
    return res.status(200).json({ message: "Friend request rejected", user });

  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports.removeFriend = async (req, res) => {
  const userID = req.user.id;
  const id = req.params.id;
  try {
    const user = await user.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const sender = await user.findById(id);
    if (!sender) {
      return res.status(404).json({ message: "User not found" });
    }

    const friendIndex = user.friends.indexOf(id);
    if (friendIndex === -1) {
      return res.status(400).json({ message: "This user is not your friend" });
    }
    user.friends = user.friends.filter(friend => friend !== id);
    sender.friends = sender.friends.filter(friend => friend !== userID);
    await user.save();
    await sender.save();
    return res.status(200).json({ message: "Friend removed successfully", user });

  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports.getFriends = async (req, res) => {
  const userID = req.user.id;
  try {
    const user = await user.findById(userID).populate('friends', 'username');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.friends.length === 0) {
      return res.status(200).json({ message: "You have no friends yet" });
    }

    return res.status(200).json({ friends: user.friends });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports.getFriendRequests = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await user.findById(userId).populate('requestsReceived', 'username').populate('requestsSent', 'username');;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.requestsReceived.length == 0 || user.requestsSent.length === 0) return res.status(200).json({ message: "You have no friends requests yet" });

    return res.status(200).json({ requestsReceived: user.requestsReceived, requestsSent: user.requestsSent });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}
