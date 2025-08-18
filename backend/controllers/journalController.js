const journalModel = require('../models/journalModel');
const geminiModel = require('../gemini-practice/gemini-start');
const dayjs = require('dayjs');
const userModel = require('../models/userModel');
const mongoose = require('mongoose');


module.exports.createJournal = async (req, res) => {
  const { title, description, imageUrl, locationName, coordinates, country } = req.body;
  console.log("The journal's country is: ", country.toString());
  const userId = req.user.id;
  try {

    const user = await userModel.findById(userId);
    if (!user) {
      console.error("User not found, error found at createJournal controller");
    }
    if (!title || !locationName || !coordinates) {
      return res.status(400).json({ message: "Title, location name, and coordinates are required" });
    }
    const alreadyVisited = user.countriesVisited.includes(country);
    if (!alreadyVisited) {
      user.countriesVisited.push(country);
    }

    await user.save();


    const newJournal = await journalModel.create({
      userId,
      title,
      description,
      imageUrl,
      location: locationName,
      coordinates,


    })
    return res.status(201).json({
      message: "Journal created successfully",
      journal: newJournal,
    });
  } catch (error) {
    console.error("Error creating journal:", error.message);
    return res.status(500).json({ message: "Internal server error" });

  }

}

module.exports.getAllJournals = async (req, res) => {
  const userId = req.user.id;
  try {
    if (!userId || userId === "") {
      return res.status(400).json({ message: "User ID is required" });
    }
    const journals = await journalModel.find({ userId }).sort({ createdAt: -1 });
    if (journals.length === 0 || !journals) {
      return res.status(404).json({ message: "No journals found" });
    }
    const formattedJournals = journals.map(journal => ({
      id: journal.id,
      title: journal.title,
      description: journal.description,
      imageUrl: journal.imageUrl,
      location: journal.location,
      coordinates: journal.coordinates,
      createdAtRaw: journal.createdAt,
      createdAt: dayjs(journal.createdAt).format('MMM D, YYYY h:mm A'),
    }))
    return res.status(200).json({
      message: "Journals fetched successfully",
      formattedJournals,
    });

  } catch (err) {
    console.error("Error fetching journals:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports.getRecentEntries = async (req, res) => {
  const userId = req.params.userId;

  if (!userId || userId === "") {
    return res.status(400).json({ message: "User ID is required" });
  }


  try {
    const recentJournals = await journalModel.find({ userId }).sort({ createdAt: -1 }).limit(3);
    // if (recentJournals.length === 0 || !recentJournals) {
    //   return res.status(404).json({ message: "No recent journals found" });
    // }
    return res.status(200).json({
      recentJournals,
    })

  } catch (err) {
    console.error("Error fetching recent entries:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}
module.exports.getJournalById = async (req, res) => {
  const journalId = req.params.id;

  try {
    if (!journalId || journalId === "")
      return res.status(400).json({ message: "Journal ID is required" });

    const journal = await journalModel.findById(journalId);
    if (!journal) return res.status(404).json({ message: "Journal not found" });
    return res.status(200).json({
      journalReq: {
        title: journal.title,
        description: journal.description,
        imageUrl: journal.imageUrl,
        aiCaption: journal.aiCaption,
      }
    });

  } catch (err) {
    console.error("Error fetching journal by ID:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports.updateJournal = async (req, res) => {

}

module.exports.deleteJournal = async (req, res) => {

}

module.exports.askGemini = async (req, res) => {
  const { locationName, title } = req.body;
  try {
    const response = await geminiModel(locationName, title);
    const aiCaption = response.data;
    return res.status(200).json({
      message: "AI caption generated successfully",
      aiCaption,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports.addLike = async (req, res) => {
  const userId = req.user.id;
  const journalId = req.params.id;

  try {
    const user = await userModel.findById(userId).select("likedPosts");
    const journal = await journalModel.findById(journalId).select("likes");

    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadyLiked = journal.likes.includes(userId);

    if (alreadyLiked) {
      // UNLIKE
      journal.likes = journal.likes.filter(id => id.toString() !== userId);
      user.likedPosts = user.likedPosts.filter(id => id.toString() !== journalId);

      await journal.save();
      await user.save();

      return res.status(200).json({
        message: "Journal unliked successfully",
        status: false,
        likesCount: journal.likes.length
      });
    } else {
      // LIKE
      journal.likes.push(userId);
      user.likedPosts.push(journalId);

      await journal.save();
      await user.save();

      return res.status(200).json({
        message: "Journal liked successfully",
        status: true,
        likesCount: journal.likes.length
      });
    }

  } catch (err) {
    console.error("Error adding like:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};



