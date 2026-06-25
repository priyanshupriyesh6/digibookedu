const express = require('express');
const { authenticateToken, requireRole } = require('../middlewares/auth');
const courseController = require('../controllers/courseController');

const router = express.Router();

router.get('/', courseController.getCourses);
router.post('/', authenticateToken, requireRole(['teacher', 'admin']), courseController.createCourse);
router.get('/progress', authenticateToken, courseController.getProgress);
router.post('/progress', authenticateToken, requireRole(['teacher', 'admin']), courseController.updateProgress);
router.get('/progress/all', authenticateToken, requireRole(['teacher', 'admin']), courseController.getAllProgress);
router.post('/module-complete', authenticateToken, courseController.completeModule);
router.post('/enroll', authenticateToken, courseController.enroll);
router.delete('/:id', authenticateToken, requireRole(['admin']), courseController.deleteCourse);

module.exports = router;
