const fs = require('fs');
const path = require('path');
const { collection } = require('../db');

const LOG_PATH = path.join(__dirname, '..', 'activity.log');

async function getLogs() {
  try {
    const contents = fs.readFileSync(LOG_PATH, 'utf8');
    return contents.split('\n').filter(Boolean).reverse();
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function getUsers() {
  return collection('users')
    .find({}, { projection: { password: 0 } })
    .sort({ id: 1 })
    .toArray();
}

async function updateUserRole(userId, role) {
  if (!['student', 'teacher', 'admin', 'marketing'].includes(role)) {
    const error = new Error('Invalid role selection.');
    error.status = 400;
    throw error;
  }

  const avatar = role === 'student' ? '🎓' : role === 'teacher' ? '👨‍🏫' : '👑';
  await collection('users').updateOne({ id: Number(userId) }, { $set: { role, avatar } });
  return { message: 'User role updated successfully.' };
}

async function deleteUser(userId, currentUserId) {
  if (Number(userId) === Number(currentUserId)) {
    const error = new Error('Cannot delete your own administrator account.');
    error.status = 400;
    throw error;
  }

  await collection('users').deleteOne({ id: Number(userId) });
  return { message: 'User account deleted successfully.' };
}

async function getStats() {
  const users = await collection('users').find().toArray();
  const coursesCount = await collection('courses').countDocuments();
  const blogsCount = await collection('blogs').countDocuments();
  const enrollmentsCount = await collection('progress').countDocuments();

  const summary = users.reduce(
    (acc, user) => {
      if (user.role === 'student') acc.students += 1;
      if (user.role === 'teacher') acc.teachers += 1;
      if (user.role === 'admin') acc.admins += 1;
      return acc;
    },
    { students: 0, teachers: 0, admins: 0 }
  );

  return {
    users: {
      students: summary.students,
      teachers: summary.teachers,
      admins: summary.admins,
      total: summary.students + summary.teachers + summary.admins
    },
    courses: coursesCount,
    blogs: blogsCount,
    enrollments: enrollmentsCount
  };
}

module.exports = {
  getLogs,
  getUsers,
  updateUserRole,
  deleteUser,
  getStats
};
