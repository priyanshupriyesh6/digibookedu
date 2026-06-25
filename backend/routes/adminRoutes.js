const express = require('express');
const { authenticateToken, requireRole } = require('../middlewares/auth');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.get('/logs', authenticateToken, requireRole(['admin']), adminController.getLogs);
router.get('/users', authenticateToken, requireRole(['admin']), adminController.getUsers);
router.put('/users/:id/role', authenticateToken, requireRole(['admin']), adminController.updateUserRole);
router.delete('/users/:id', authenticateToken, requireRole(['admin']), adminController.deleteUser);
router.get('/stats', authenticateToken, requireRole(['admin']), adminController.getStats);

module.exports = router;
