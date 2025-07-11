const express = require('express');
const journalRouter = express.Router();

journalRouter.post('/');

journalRouter.get('/');
journalRouter.get('/:id');

journalRouter.put('/:id');

journalRouter.delete('/:id');

journalRouter.get('/nearby?lat=<latitude>&lng=<longitude>&radius=<km>');

module.exports = journalRouter;