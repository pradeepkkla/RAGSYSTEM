const express = require('express');
const { askQuestion, getChats, deleteChat, clearAllChats } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, askQuestion);
router.get('/', protect, getChats);
router.delete('/all', protect, clearAllChats);
router.delete('/:id', protect, deleteChat);

module.exports = router;
