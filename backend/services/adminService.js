const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { collection, getNextId } = require('../db');

const LOG_PATH = path.join(__dirname, '..', 'activity.log');

let clerkClient;
try {
  if (process.env.CLERK_SECRET_KEY) {
    const { createClerkClient } = require('@clerk/backend');
    clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
  }
} catch (err) {
  console.error('Failed to initialize Clerk client in adminService:', err.message);
}

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

async function createUser(payload) {
  const { name, email, password, role } = payload;
  if (!name || !email || !password || !role) {
    const error = new Error('Please fill in all fields (name, email, password, role).');
    error.status = 400;
    throw error;
  }

  if (!['student', 'teacher', 'admin', 'marketing'].includes(role)) {
    const error = new Error('Invalid role selected.');
    error.status = 400;
    throw error;
  }

  // Check MongoDB
  const existingUser = await collection('users').findOne({ email: email.toLowerCase().trim() });
  if (existingUser) {
    const error = new Error('A user with this email address already exists.');
    error.status = 400;
    throw error;
  }

  // Create on Clerk first
  let clerkUserRecord = null;
  if (process.env.CLERK_SECRET_KEY && clerkClient) {
    try {
      clerkUserRecord = await clerkClient.users.createUser({
        emailAddress: [email.toLowerCase().trim()],
        password: password,
        firstName: name.split(' ')[0] || '',
        lastName: name.split(' ').slice(1).join(' ') || '',
        skipPasswordChecks: true
      });
      console.log('Successfully created user on Clerk:', clerkUserRecord.id);
    } catch (err) {
      const errMsg = err.errors && err.errors[0] ? err.errors[0].message : err.message;
      const error = new Error(`Clerk user creation failed: ${errMsg}`);
      error.status = 422;
      throw error;
    }
  }

  // Hash password for local database (legacy/developer logins)
  const hashedPassword = await bcrypt.hash(password, 10);
  const avatar = role === 'student' ? '🎓' : role === 'teacher' ? '👨‍🏫' : role === 'admin' ? '👑' : '📢';
  const id = await getNextId('users');

  const newUser = {
    id,
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    name: name.trim(),
    role,
    avatar,
    clerkId: clerkUserRecord ? clerkUserRecord.id : null
  };

  await collection('users').insertOne(newUser);
  return { message: 'User provisioned successfully.', user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role } };
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

  const targetUser = await collection('users').findOne({ id: Number(userId) });
  if (targetUser && targetUser.clerkId && process.env.CLERK_SECRET_KEY && clerkClient) {
    try {
      await clerkClient.users.deleteUser(targetUser.clerkId);
      console.log('Successfully deleted user from Clerk:', targetUser.clerkId);
    } catch (err) {
      console.warn('Failed to delete user from Clerk:', err.message);
    }
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
  createUser,
  updateUserRole,
  deleteUser,
  getStats
};
