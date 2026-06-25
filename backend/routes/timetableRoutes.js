const express = require('express');
const { authenticateToken, requireRole } = require('../middlewares/auth');
const timetableController = require('../controllers/timetableController');

const router = express.Router();

router.get('/', timetableController.getTimetable);
router.post('/', authenticateToken, requireRole(['teacher', 'admin']), timetableController.createTimetable);

module.exports = router;
