const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { collection, getNextId } = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'digibookedu-super-secret-key';

function buildPublicUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar
  };
}

function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

async function findByEmail(email) {
  return collection('users').findOne({ email: email.toLowerCase().trim() });
}

async function findUserById(userId) {
  const user = await collection('users').findOne({ id: Number(userId) });
  if (!user) {
    const error = new Error('User session not found.');
    error.status = 404;
    throw error;
  }
  return buildPublicUser(user);
}

async function register(payload) {
  const { email, password, name, role } = payload;
  if (!email || !password || !name || !role) {
    const error = new Error('Please provide all required fields.');
    error.status = 400;
    throw error;
  }

  if (!['student', 'teacher'].includes(role)) {
    const error = new Error('Invalid role selection.');
    error.status = 400;
    throw error;
  }

  const existingUser = await findByEmail(email);
  if (existingUser) {
    const error = new Error('A user with this email already exists.');
    error.status = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const avatar = role === 'student' ? '🎓' : '👨‍🏫';
  const id = await getNextId('users');
  const user = {
    id,
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    name: name.trim(),
    role,
    avatar
  };

  await collection('users').insertOne(user);

  const token = signToken(user);

  return {
    token,
    user: buildPublicUser(user)
  };
}

async function login(payload) {
  const { email, password } = payload;
  if (!email || !password) {
    const error = new Error('Please enter email and password.');
    error.status = 400;
    throw error;
  }

  const user = await findByEmail(email);
  if (!user) {
    const error = new Error('Invalid credentials. User not found.');
    error.status = 400;
    throw error;
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    const error = new Error('Invalid credentials. Password incorrect.');
    error.status = 400;
    throw error;
  }

  const token = signToken(user);

  return {
    token,
    user: buildPublicUser(user)
  };
}

module.exports = {
  register,
  login,
  findUserById
};
