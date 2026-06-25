const express = require('express');
const { authenticateToken, requireRole } = require('../middlewares/auth');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/students', authenticateToken, requireRole(['teacher', 'admin']), userController.getStudents);

module.exports = router;
