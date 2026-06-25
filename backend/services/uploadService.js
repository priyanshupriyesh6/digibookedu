const { uploadBuffer } = require('../utils/cloudinary');

async function uploadFile(buffer) {
  const result = await uploadBuffer(buffer, 'digibookedu/uploads');
  return {
    public_id: result.public_id,
    secure_url: result.secure_url,
    resource_type: result.resource_type,
    format: result.format
  };
}

module.exports = {
  uploadFile
};
