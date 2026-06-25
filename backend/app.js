const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const courseRoutes = require('./routes/courseRoutes');
const blogRoutes = require('./routes/blogRoutes');
const timetableRoutes = require('./routes/timetableRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const logRoutes = require('./routes/logRoutes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const corsOptions = process.env.PUBLIC_URL ? { origin: process.env.PUBLIC_URL } : {};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/logs', logRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
