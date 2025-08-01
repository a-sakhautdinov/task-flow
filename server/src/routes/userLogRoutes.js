const express = require('express');
const userLogController = require('../controller/userLogController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create', protect, adminOnly, userLogController.createUserLog);

router.get('/logs', protect, adminOnly, userLogController.getUserLogs);

router.get('/stats', protect, adminOnly, userLogController.getUserLogStats);

router.delete('/logs/:logId', protect, adminOnly, userLogController.deleteUserLog);

router.delete('/logs', protect, adminOnly, userLogController.deleteMultipleLogs);

module.exports = router; 