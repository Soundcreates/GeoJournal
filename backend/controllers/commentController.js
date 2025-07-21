const commentModel = require('../models/commentModel');
const userModel = require('../models/userModel');
const journalModel = require('../models/journalModel');

module.exports.addComment = async (req, res) => {
  const { commentText, journalId } = req.body;
  const userId = req.user.id;
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const journal = await journalModel.findById(journalId);
    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }
    if (!commentText || commentText.trim() === " ") {
      return res.status(400).json({ message: "Comment text cannot be empty" });
    }

    const newComment = await commentModel.create({
      userId: userId,
      journalEntryId: journalId,
      commentText: commentText,
    });

    return res.status(200).json({ message: "Comment added successfully", comment: newComment });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports.getJournalComments = async (req, res) => {
  const journalId = req.params.JournalId;
  try {
    const journal = await journalModel.findById(journalId);
    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }
    const comments = await commentModel.find({ journalEntryId: journalId }).populate('userId', 'name profilePicture');
    if (!comments || comments.length === 0) return res.status(404).json({ message: "No comments found for this journal" });

    return res.status(200).json({ message: "Comments retrieved successfully", comments });

  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports.updateComment = async (req, res) => {
  const commentId = req.params.id;
  const { commentText } = req.body;
  const userId = req.user.id;
  try {
    const comment = await commentModel.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to update this comment" });
    }
    if (!commentText || commentText.trim() === " ") {
      return res.status(400).json({ message: "Comment text cannot be empty" });
    }
    comment.commentText = commentText;
    await comment.save();
    return res.status(200).json({ message: "Comment updated successfully", comment });

  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports.deleteComment = async (req, res) => {
  const commentId = req.params.id;
  const userId = req.user.id;
  try {
    const comment = await commentModel.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to delete this comment" });
    }

    await commentModel.findByIdAndDelete(commentId);
    return res.status(200).json({ message: "Comment deleted successfully" });


  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal server error" });
  }

}

