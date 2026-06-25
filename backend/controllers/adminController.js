const adminService = require('../services/adminService');

async function getLogs(req, res, next) {
  try {
    const logs = await adminService.getLogs();
    res.json(logs);
  } catch (error) {
    next(error);
  }
}

async function getUsers(req, res, next) {
  try {
    const users = await adminService.getUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
}

async function updateUserRole(req, res, next) {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const result = await adminService.updateUserRole(Number(id), role);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    const id = Number(req.params.id);
    const result = await adminService.deleteUser(id, req.user.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function getStats(req, res, next) {
  try {
    const stats = await adminService.getStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getLogs,
  getUsers,
  updateUserRole,
  deleteUser,
  getStats
};
