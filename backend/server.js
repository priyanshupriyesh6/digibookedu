const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { db, run, get, all } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'digibookedu-super-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Log User Activity to activity.log
app.post('/api/logs', (req, res) => {
    const { type, message, user } = req.body;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const logLine = `[${timestamp}] [${type || 'INFO'}] [${user || 'Anonymous'}] ${message}\n`;

    const logPath = path.join(__dirname, 'activity.log');
    
    fs.appendFile(logPath, logLine, (err) => {
        if (err) {
            console.error('Failed to write to log file:', err.message);
            return res.status(500).json({ error: 'Failed to write log' });
        }
        console.log(`LOG: ${logLine.trim()}`);
        res.json({ success: true });
    });
});

// Token Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ error: 'Access token missing' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid or expired token' });
        req.user = user;
        next();
    });
};

// Role Check Middleware
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        }
        next();
    };
};

// ── Auth Endpoints ─────────────────────────────────────────────────────────

// Register
app.post('/api/auth/register', async (req, res) => {
    const { email, password, name, role } = req.body;
    if (!email || !password || !name || !role) {
        return res.status(400).json({ error: 'Please provide all required fields.' });
    }
    
    if (!['student', 'teacher'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role selection.' });
    }

    try {
        const existing = await get('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
        if (existing) {
            return res.status(400).json({ error: 'A user with this email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const avatar = role === 'student' ? '🎓' : '👨‍🏫';
        
        const result = await run(
            'INSERT INTO users (email, password, name, role, avatar) VALUES (?, ?, ?, ?, ?)',
            [email.toLowerCase().trim(), hashedPassword, name.trim(), role, avatar]
        );

        const userId = result.id;
        const token = jwt.sign({ id: userId, email, role, name }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            token,
            user: { id: userId, email, name, role, avatar }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Please enter email and password.' });
    }

    try {
        const user = await get('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials. User not found.' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid credentials. Password incorrect.' });
        }

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            user: { id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Auth0 Callback (Register/Login exchange)
app.post('/api/auth/auth0-callback', async (req, res) => {
    const { email, name, avatar } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Please provide user email.' });
    }

    try {
        const normalizedEmail = email.toLowerCase().trim();
        // Check if user exists in local SQLite database
        let user = await get('SELECT * FROM users WHERE email = ?', [normalizedEmail]);
        
        if (!user) {
            // Register as default role: 'student'
            const defaultPasswordPlaceholder = await bcrypt.hash('auth0-oauth-managed-password', 10);
            const defaultAvatar = avatar || '🎓';
            const defaultRole = 'student';
            
            const result = await run(
                'INSERT INTO users (email, password, name, role, avatar) VALUES (?, ?, ?, ?, ?)',
                [normalizedEmail, defaultPasswordPlaceholder, name ? name.trim() : normalizedEmail.split('@')[0], defaultRole, defaultAvatar]
            );
            
            user = {
                id: result.id,
                email: normalizedEmail,
                name: name ? name.trim() : normalizedEmail.split('@')[0],
                role: defaultRole,
                avatar: defaultAvatar
            };
        }

        // Generate custom JWT token for Express session authorization
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, name: user.name },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: { id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Auth Me (Fetch Current Session)
app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        const user = await get('SELECT id, email, name, role, avatar FROM users WHERE id = ?', [req.user.id]);
        if (!user) return res.status(404).json({ error: 'User session not found.' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── Profile Endpoints ──────────────────────────────────────────────────────

// Update Profile Detail
app.post('/api/profile/update', authenticateToken, async (req, res) => {
    const { name, avatar } = req.body;
    if (!name) return res.status(400).json({ error: 'Name cannot be empty.' });

    try {
        await run('UPDATE users SET name = ?, avatar = ? WHERE id = ?', [name.trim(), avatar || '🎓', req.user.id]);
        res.json({ message: 'Profile details updated successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Password
app.post('/api/profile/update-password', authenticateToken, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        return res.status(400).json({ error: 'Please enter old and new passwords.' });
    }

    try {
        const user = await get('SELECT password FROM users WHERE id = ?', [req.user.id]);
        const isValid = await bcrypt.compare(oldPassword, user.password);
        if (!isValid) {
            return res.status(400).json({ error: 'Current password credentials incorrect.' });
        }

        const hashed = await bcrypt.hash(newPassword, 10);
        await run('UPDATE users SET password = ? WHERE id = ?', [hashed, req.user.id]);
        res.json({ message: 'Password updated successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── Course & progress Endpoints ────────────────────────────────────────────

// Get All Courses (Public)
app.get('/api/courses', async (req, res) => {
    try {
        const courses = await all('SELECT * FROM courses');
        const modules = await all('SELECT * FROM modules');
        const coursesWithModules = courses.map(course => ({
            ...course,
            featured: Boolean(course.featured),
            modules: modules.filter(m => m.courseId === course.id)
        }));
        res.json(coursesWithModules);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create Course (Teacher/Admin)
app.post('/api/courses', authenticateToken, requireRole(['teacher', 'admin']), async (req, res) => {
    const { title, category, instructor, level, duration, price, image } = req.body;
    if (!title || !category) return res.status(400).json({ error: 'Title and category are required.' });

    try {
        const resCourse = await run(
            `INSERT INTO courses (title, category, instructor, rating, students, price, originalPrice, level, duration, lessons, image, featured)
             VALUES (?, ?, ?, 5.0, 0, ?, ?, ?, ?, 6, ?, 1)`,
            [title, category, instructor || req.user.name, price || 0, (price || 0) * 2, level || 'Beginner', duration || '12 hours', image || '']
        );
        
        const courseId = resCourse.id;

        // Default Chapters
        const defaultModules = [
            { title: "Course Introduction & Syllabus Review", duration: "2h" },
            { title: "Getting Started & Core Setup", duration: "4h" },
            { title: "Theory & Foundation Principles", duration: "6h" },
            { title: "Practical Application Exercises", duration: "8h" },
            { title: "Real-world Project Implementation", duration: "10h" },
            { title: "Final Exam & Certification Path", duration: "4h" }
        ];

        for (const mod of defaultModules) {
            await run('INSERT INTO modules (courseId, title, duration) VALUES (?, ?, ?)', [courseId, mod.title, mod.duration]);
        }

        res.status(201).json({ id: courseId, title, message: 'Course created.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get User Progress Map
app.get('/api/courses/progress', authenticateToken, async (req, res) => {
    try {
        let userId = req.user.id;
        // If teacher/admin passes target studentId, fetch theirs
        if ((req.user.role === 'teacher' || req.user.role === 'admin') && req.query.studentId) {
            userId = req.query.studentId;
        }

        const list = await all('SELECT * FROM progress WHERE userId = ?', [userId]);
        const progressMap = {};
        list.forEach(p => {
            progressMap[p.courseId] = {
                percent: p.percent,
                grade: p.grade,
                remarks: p.remarks
            };
        });
        res.json(progressMap);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update User Progress Card (Teacher/Admin)
app.post('/api/courses/progress', authenticateToken, requireRole(['teacher', 'admin']), async (req, res) => {
    const { studentId, courseId, percent, grade, remarks } = req.body;
    if (!studentId || !courseId) return res.status(400).json({ error: 'Missing student or course parameters.' });

    try {
        // Check if progress already exists
        const existing = await get('SELECT userId FROM progress WHERE userId = ? AND courseId = ?', [studentId, courseId]);
        if (existing) {
            await run(
                'UPDATE progress SET percent = ?, grade = ?, remarks = ? WHERE userId = ? AND courseId = ?',
                [Number(percent), grade, remarks, studentId, courseId]
            );
        } else {
            await run(
                'INSERT INTO progress (userId, courseId, percent, grade, remarks) VALUES (?, ?, ?, ?, ?)',
                [studentId, courseId, Number(percent), grade, remarks]
            );
        }
        res.json({ message: 'Progress updated successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Toggle module completion (Student self progress increase)
app.post('/api/courses/module-complete', authenticateToken, async (req, res) => {
    const { courseId, moduleId } = req.body;
    if (!courseId) return res.status(400).json({ error: 'Course ID required.' });

    try {
        const courseModules = await all('SELECT id FROM modules WHERE courseId = ?', [courseId]);
        const totalModules = courseModules.length || 6;
        const step = Math.round(100 / totalModules);

        // Get current progress
        const curr = await get('SELECT percent, grade, remarks FROM progress WHERE userId = ? AND courseId = ?', [req.user.id, courseId]);
        
        let newPercent = step;
        let oldRemarks = 'Started learning.';
        
        if (curr) {
            newPercent = curr.percent + step;
            oldRemarks = curr.remarks || '';
        }
        if (newPercent > 100) newPercent = 100;

        let newGrade = 'B';
        if (newPercent >= 90) newGrade = 'A+';
        else if (newPercent >= 80) newGrade = 'A';
        else if (newPercent >= 70) newGrade = 'B+';
        else if (newPercent >= 50) newGrade = 'B';
        else newGrade = 'C';

        const finalRemarks = newPercent === 100 ? 'Course complete! Excellent work!' : oldRemarks;

        if (curr) {
            await run(
                'UPDATE progress SET percent = ?, grade = ?, remarks = ? WHERE userId = ? AND courseId = ?',
                [newPercent, newGrade, finalRemarks, req.user.id, courseId]
            );
        } else {
            await run(
                'INSERT INTO progress (userId, courseId, percent, grade, remarks) VALUES (?, ?, ?, ?, ?)',
                [req.user.id, courseId, newPercent, newGrade, finalRemarks]
            );
        }

        res.json({ percent: newPercent, grade: newGrade, remarks: finalRemarks });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all progress maps grouped by student (Teacher/Admin view)
app.get('/api/courses/progress/all', authenticateToken, requireRole(['teacher', 'admin']), async (req, res) => {
    try {
        const list = await all('SELECT * FROM progress');
        const grouped = {};
        list.forEach(p => {
            if (!grouped[p.userId]) {
                grouped[p.userId] = {};
            }
            grouped[p.userId][p.courseId] = {
                percent: p.percent,
                grade: p.grade,
                remarks: p.remarks
            };
        });
        res.json(grouped);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Enroll Student in a course directly (e.g. initial setup or teacher manual)
app.post('/api/courses/enroll', authenticateToken, async (req, res) => {
    const { courseId } = req.body;
    try {
        const existing = await get('SELECT userId FROM progress WHERE userId = ? AND courseId = ?', [req.user.id, courseId]);
        if (!existing) {
            await run('INSERT INTO progress (userId, courseId, percent, grade, remarks) VALUES (?, ?, 0, "B", "Enrolled.")', [req.user.id, courseId]);
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── Blog Endpoints ─────────────────────────────────────────────────────────

// Get Blogs (Public)
app.get('/api/blogs', async (req, res) => {
    try {
        const list = await all('SELECT * FROM blogs ORDER BY id DESC');
        res.json(list);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create Blog (Teacher/Admin/Marketing)
app.post('/api/blogs', authenticateToken, requireRole(['teacher', 'admin', 'marketing']), async (req, res) => {
    const { title, category, summary, content, image } = req.body;
    if (!title || !content || !summary) return res.status(400).json({ error: 'Title, summary, and content are required.' });

    const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const readTime = `${Math.max(3, Math.round(content.split(' ').length / 200))} min read`;
    const author = req.user.name;

    try {
        const result = await run(
            `INSERT INTO blogs (title, category, author, date, readTime, summary, content, image)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, category || 'General', author, date, readTime, summary, content, image || '']
        );
        res.status(201).json({ id: result.id, title, message: 'Blog post published live!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── Timetable Endpoints ────────────────────────────────────────────────────

// Get Timetable (Public/Auth)
app.get('/api/timetable', async (req, res) => {
    try {
        const list = await all(`
            SELECT timetable.*, courses.title AS courseTitle 
            FROM timetable 
            LEFT JOIN courses ON timetable.courseId = courses.id 
            ORDER BY timetable.id ASC
        `);
        res.json(list);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create Timetable Slot (Teacher/Admin)
app.post('/api/timetable', authenticateToken, requireRole(['teacher', 'admin']), async (req, res) => {
    const { courseId, topic, date, time, link } = req.body;
    if (!courseId || !topic || !date || !time || !link) {
        return res.status(400).json({ error: 'Please provide all class schedule fields.' });
    }

    try {
        const course = await get('SELECT title FROM courses WHERE id = ?', [courseId]);
        const courseTitle = course ? course.title : 'General Lecture';
        const instructor = req.user.name;

        const result = await run(
            `INSERT INTO timetable (courseId, topic, date, time, instructor, link)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [courseId, topic, date, time, instructor, link]
        );
        res.status(201).json({ id: result.id, courseTitle, topic, message: 'Timetable class slot scheduled.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Students List (Teacher/Admin)
app.get('/api/users/students', authenticateToken, requireRole(['teacher', 'admin']), async (req, res) => {
    try {
        const list = await all("SELECT id, email, name, role, avatar FROM users WHERE role = 'student' ORDER BY name ASC");
        res.json(list);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── Admin Endpoints ────────────────────────────────────────────────────────

// Get Activity Logs (Admin)
app.get('/api/admin/logs', authenticateToken, requireRole(['admin']), (req, res) => {
    const logPath = path.join(__dirname, 'activity.log');
    fs.readFile(logPath, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                return res.json([]);
            }
            return res.status(500).json({ error: 'Failed to read logs' });
        }
        const lines = data.split('\n').filter(Boolean).reverse();
        res.json(lines);
    });
});

// Get All Users (Admin)
app.get('/api/admin/users', authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
        const list = await all('SELECT id, email, name, role, avatar FROM users ORDER BY id ASC');
        res.json(list);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update User Role (Admin)
app.put('/api/admin/users/:id/role', authenticateToken, requireRole(['admin']), async (req, res) => {
    const { role } = req.body;
    const { id } = req.params;

    if (!['student', 'teacher', 'admin', 'marketing'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role selection.' });
    }

    try {
        const avatar = role === 'student' ? '🎓' : role === 'teacher' ? '👨‍🏫' : '👑';
        await run('UPDATE users SET role = ?, avatar = ? WHERE id = ?', [role, avatar, id]);
        res.json({ message: 'User role updated successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete User (Admin)
app.delete('/api/admin/users/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
    const { id } = req.params;
    if (Number(id) === req.user.id) {
        return res.status(400).json({ error: 'Cannot delete your own administrator account.' });
    }

    try {
        await run('DELETE FROM users WHERE id = ?', [id]);
        res.json({ message: 'User account deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Blog Post (Teacher/Admin/Marketing)
app.delete('/api/blogs/:id', authenticateToken, requireRole(['teacher', 'admin', 'marketing']), async (req, res) => {
    try {
        await run('DELETE FROM blogs WHERE id = ?', [req.params.id]);
        res.json({ message: 'Blog post deleted.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Course (Admin)
app.delete('/api/courses/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
        await run('DELETE FROM courses WHERE id = ?', [req.params.id]);
        res.json({ message: 'Course deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Admin Dashboard Stats (Admin)
app.get('/api/admin/stats', authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
        const usersCount = await get(`
            SELECT 
                SUM(CASE WHEN role = 'student' THEN 1 ELSE 0 END) AS students,
                SUM(CASE WHEN role = 'teacher' THEN 1 ELSE 0 END) AS teachers,
                SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) AS admins
            FROM users
        `);
        const coursesCount = await get('SELECT COUNT(*) AS count FROM courses');
        const blogsCount = await get('SELECT COUNT(*) AS count FROM blogs');
        const enrollmentsCount = await get('SELECT COUNT(*) AS count FROM progress');

        res.json({
            users: {
                students: usersCount.students || 0,
                teachers: usersCount.teachers || 0,
                admins: usersCount.admins || 0,
                total: (usersCount.students || 0) + (usersCount.teachers || 0) + (usersCount.admins || 0)
            },
            courses: coursesCount.count || 0,
            blogs: blogsCount.count || 0,
            enrollments: enrollmentsCount.count || 0
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 404 fallback
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n  Backend listening on port ${PORT}...`);
});
