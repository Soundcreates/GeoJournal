const express = require('express');
const journalRouter = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { askGemini, createJournal, getAllJournals, getJournalById, updateJournal, deleteJournal } = require('../controllers/journalController');

journalRouter.post('/', authMiddleware, createJournal);

journalRouter.get('/', authMiddleware, getAllJournals);
journalRouter.get('/:id', authMiddleware, getJournalById);

journalRouter.put('/:id', authMiddleware, updateJournal);

journalRouter.delete('/:id', authMiddleware, deleteJournal);

// Route for asking Gemini AI
journalRouter.post('/ask-gemini', authMiddleware, askGemini);


module.exports = journalRouter;