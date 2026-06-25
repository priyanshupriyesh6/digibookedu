const uploadService = require('../services/uploadService');

async function uploadFile(req, res, next) {
  try {
    if (!req.file) {
      const error = new Error('No file uploaded. Please attach an image or video.');
      error.status = 400;
      throw error;
    }

    const result = await uploadService.uploadFile(req.file.buffer);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  uploadFile
};
