const express = require('express');
const { authenticateToken } = require('../middlewares/auth');
const profileController = require('../controllers/profileController');

const router = express.Router();

router.post('/update', authenticateToken, profileController.updateProfile);
router.post('/update-password', authenticateToken, profileController.updatePassword);

module.exports = router;
