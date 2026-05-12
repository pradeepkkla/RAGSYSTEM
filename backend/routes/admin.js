const express = require('express');
const { getStats, getLogs } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.get('/logs', getLogs);

module.exports = router;
