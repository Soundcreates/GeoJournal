const express = require('express');
const commentRouter = express.Router();

commentRouter.post('/');
commentRouter.get('/:JournalId');
commentRouter.put('/:id');
commentRouter.delete('/:id');

module.exports = commentRouter;