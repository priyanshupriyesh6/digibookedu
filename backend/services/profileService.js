const bcrypt = require('bcryptjs');
const { collection } = require('../db');

async function updateProfile(userId, { name, avatar }) {
  if (!name || !name.trim()) {
    const error = new Error('Name cannot be empty.');
    error.status = 400;
    throw error;
  }

  await collection('users').updateOne(
    { id: Number(userId) },
    { $set: { name: name.trim(), avatar: avatar || '🎓' } }
  );

  return { message: 'Profile details updated successfully.' };
}

async function updatePassword(userId, { oldPassword, newPassword }) {
  if (!oldPassword || !newPassword) {
    const error = new Error('Please enter old and new passwords.');
    error.status = 400;
    throw error;
  }

  const user = await collection('users').findOne({ id: Number(userId) });
  if (!user) {
    const error = new Error('User not found.');
    error.status = 404;
    throw error;
  }

  const validPassword = await bcrypt.compare(oldPassword, user.password);
  if (!validPassword) {
    const error = new Error('Current password credentials incorrect.');
    error.status = 400;
    throw error;
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await collection('users').updateOne({ id: Number(userId) }, { $set: { password: hashed } });

  return { message: 'Password updated successfully.' };
}

module.exports = {
  updateProfile,
  updatePassword
};
