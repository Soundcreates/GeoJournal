const journalModel = require('../models/journalModel');
const geminiModel = require('../gemini-practice/gemini-start');

module.exports.createJournal = async (req, res) => {
  const { title, description, imageUrl, locationName, coordinates } = req.body;
  console.log("create journal endpoint hit!");
  const userId = req.user.id;
  try {
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

}

module.exports.getJournalById = async (req, res) => {

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

