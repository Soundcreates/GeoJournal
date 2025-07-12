const express = require('express');
const commentRouter = express.Router();
const { addComment, getJournalComments, updateComment, deleteComment } = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

commentRouter.post('/', authMiddleware, addComment);
commentRouter.get('/:JournalId', authMiddleware, getJournalComments);
commentRouter.put('/:id', authMiddleware, updateComment);
commentRouter.delete('/:id', authMiddleware, deleteComment);

module.exports = commentRouter;