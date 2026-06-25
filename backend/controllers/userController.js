const userService = require('../services/userService');

async function getStudents(req, res, next) {
  try {
    const students = await userService.getStudents();
    res.json(students);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getStudents
};
