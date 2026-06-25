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
    avatar: user.avatar,
    clerkId: user.clerkId || null
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

let clerkClient;
try {
  if (process.env.CLERK_SECRET_KEY) {
    const { createClerkClient } = require('@clerk/backend');
    clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
  }
} catch (err) {
  console.error('Failed to initialize Clerk client:', err.message);
}

async function clerkSync(clerkToken, payload) {
  let email = payload.email;
  let name = payload.name;
  let clerkId = payload.clerkId;
  let avatar = payload.avatar;

  if (process.env.CLERK_SECRET_KEY && clerkClient) {
    if (!clerkToken) {
      const error = new Error('Clerk token missing');
      error.status = 401;
      throw error;
    }
    try {
      const verified = await clerkClient.verifyToken(clerkToken);
      clerkId = verified.sub;
      const userRecord = await clerkClient.users.getUser(clerkId);
      email = userRecord.emailAddresses[0]?.emailAddress;
      name = `${userRecord.firstName || ''} ${userRecord.lastName || ''}`.trim() || userRecord.username || 'Clerk User';
      avatar = userRecord.imageUrl;
    } catch (err) {
      const error = new Error(`Clerk authentication failed: ${err.message}`);
      error.status = 401;
      throw error;
    }
  } else {
    if (!process.env.CLERK_SECRET_KEY) {
      console.warn('WARNING: CLERK_SECRET_KEY is not defined. Skipping Clerk verification and trusting frontend payload in development mode.');
    }
  }

  if (!email) {
    const error = new Error('Email address is required.');
    error.status = 400;
    throw error;
  }

  // Look up user in MongoDB by email
  const existingUser = await collection('users').findOne({ email: email.toLowerCase().trim() });
  
  if (!existingUser) {
    const error = new Error('Your email address has not been registered on this portal. Please contact the administrator.');
    error.status = 403;
    throw error;
  }

  // Link Clerk ID if not already linked
  if (existingUser.clerkId !== clerkId) {
    await collection('users').updateOne(
      { id: existingUser.id },
      { $set: { clerkId } }
    );
    existingUser.clerkId = clerkId;
  }

  // Sign our backend JWT token
  const token = signToken(existingUser);

  return {
    token,
    user: buildPublicUser(existingUser)
  };
}

module.exports = {
  register,
  login,
  findUserById,
  clerkSync
};
