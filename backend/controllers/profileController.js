const profileService = require('../services/profileService');

async function updateProfile(req, res, next) {
  try {
    const { name, avatar } = req.body;
    const result = await profileService.updateProfile(req.user.id, { name, avatar });
    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function updatePassword(req, res, next) {
  try {
    const { oldPassword, newPassword } = req.body;
    const result = await profileService.updatePassword(req.user.id, { oldPassword, newPassword });
    res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  updateProfile,
  updatePassword
};
