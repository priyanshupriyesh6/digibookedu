const authService = require('../services/authService');

async function register(req, res, next) {
  try {
    const payload = req.body;
    const authResult = await authService.register(payload);
    res.status(201).json(authResult);
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const payload = req.body;
    const authResult = await authService.login(payload);
    res.json(authResult);
  } catch (error) {
    next(error);
  }
}

async function me(req, res, next) {
  try {
    const user = await authService.findUserById(req.user.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  me
};
