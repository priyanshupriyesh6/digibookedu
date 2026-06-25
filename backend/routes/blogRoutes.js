const express = require('express');
const { authenticateToken, requireRole } = require('../middlewares/auth');
const blogController = require('../controllers/blogController');

const router = express.Router();

router.get('/', blogController.getBlogs);
router.post('/', authenticateToken, requireRole(['teacher', 'admin', 'marketing']), blogController.createBlog);
router.delete('/:id', authenticateToken, requireRole(['teacher', 'admin', 'marketing']), blogController.deleteBlog);

module.exports = router;
