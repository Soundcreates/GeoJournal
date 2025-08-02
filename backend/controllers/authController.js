const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.registerController = async (req, res) => {
  const { username, email, password, firstName, currentLocation } = req.body;
  console.log("register endpoint hit!");
  try {
    const user = await userModel.findOne({ email: email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
      firstName,
      currentLocation: {
        city: currentLocation.city || "Unknown City",
        country: currentLocation.country || "Unknown Country",
      }

    });
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_KEY, { expiresIn: '7d' });
    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar,
        currentLocation: newUser.currentLocation,
        profileImage: newUser.profileImage,
        firstName: newUser.firstName,
      }
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports.loginController = async (req, res) => {
  const { email, password, currentLocation } = req.body;
  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (currentLocation && currentLocation.city && currentLocation.country) {
      user.currentLocation = {
        city: currentLocation.city,
        country: currentLocation.country,
      };
      await user.save();
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, { expiresIn: '7d' });
    return res.status(200).json({
      message: "User logged in successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        firstName: user.firstName,
        currentLocation: user.currentLocation,
      }
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}



module.exports.me = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports.updateLocation = async (req, res) => {
  try {
    const { currentLocation } = req.body;
    const userId = req.user.id;
    const user = await userModel.findByIdAndUpdate(userId, {
      $set: {
        "currentLocation.city": currentLocation.city || "Unknown City",
        "currentLocation.country": currentLocation.country || "Unknown Country",
      }
    }, { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Location updated successfully",
      user
    })
  } catch (err) {
    console.error("Update location error: ", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}