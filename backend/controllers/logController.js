const logService = require('../services/logService');

async function createLog(req, res, next) {
  try {
    const { type, message, user } = req.body;
    const result = await logService.createLog({ type, message, user });
    res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createLog
};
