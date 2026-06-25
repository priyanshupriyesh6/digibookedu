const blogService = require('../services/blogService');

async function getBlogs(req, res, next) {
  try {
    const blogs = await blogService.getBlogs();
    res.json(blogs);
  } catch (error) {
    next(error);
  }
}

async function createBlog(req, res, next) {
  try {
    const blog = await blogService.createBlog(req.body, req.user.name);
    res.status(201).json(blog);
  } catch (error) {
    next(error);
  }
}

async function deleteBlog(req, res, next) {
  try {
    const blogId = Number(req.params.id);
    const result = await blogService.deleteBlog(blogId);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getBlogs,
  createBlog,
  deleteBlog
};
