const timetableService = require('../services/timetableService');

async function getTimetable(req, res, next) {
  try {
    const timetable = await timetableService.getTimetable();
    res.json(timetable);
  } catch (error) {
    next(error);
  }
}

async function createTimetable(req, res, next) {
  try {
    const newSlot = await timetableService.createTimetable(req.body, req.user.name);
    res.status(201).json(newSlot);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTimetable,
  createTimetable
};
