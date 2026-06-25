const courseService = require('../services/courseService');

async function getCourses(req, res, next) {
  try {
    const courses = await courseService.getCourses();
    res.json(courses);
  } catch (error) {
    next(error);
  }
}

async function createCourse(req, res, next) {
  try {
    const course = await courseService.createCourse(req.body, req.user.name);
    res.status(201).json(course);
  } catch (error) {
    next(error);
  }
}

async function getProgress(req, res, next) {
  try {
    const progress = await courseService.getProgress(req.user, req.query.studentId);
    res.json(progress);
  } catch (error) {
    next(error);
  }
}

async function updateProgress(req, res, next) {
  try {
    const { studentId, courseId, percent, grade, remarks } = req.body;
    const result = await courseService.updateProgress({ studentId, courseId, percent, grade, remarks });
    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function completeModule(req, res, next) {
  try {
    const { courseId } = req.body;
    const result = await courseService.completeModule(req.user.id, courseId);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function getAllProgress(req, res, next) {
  try {
    const progress = await courseService.getAllProgress();
    res.json(progress);
  } catch (error) {
    next(error);
  }
}

async function enroll(req, res, next) {
  try {
    const { courseId } = req.body;
    const result = await courseService.enroll(req.user.id, courseId);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function deleteCourse(req, res, next) {
  try {
    const courseId = Number(req.params.id);
    const result = await courseService.deleteCourse(courseId);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCourses,
  createCourse,
  getProgress,
  updateProgress,
  completeModule,
  getAllProgress,
  enroll,
  deleteCourse
};
