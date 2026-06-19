const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initializeDatabase();
    }
});

// Promise wrappers for SQL operations
const run = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, changes: this.changes });
        });
    });
};

const get = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

const all = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

async function initializeDatabase() {
    try {
        // Enable foreign key support
        await run('PRAGMA foreign_keys = ON');

        // Create Users table
        await run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            name TEXT NOT NULL,
            role TEXT NOT NULL CHECK(role IN ('student', 'teacher', 'admin', 'marketing')),
            avatar TEXT
        )`);

        // Create Courses table
        await run(`CREATE TABLE IF NOT EXISTS courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            instructor TEXT NOT NULL,
            rating REAL DEFAULT 5.0,
            students INTEGER DEFAULT 0,
            price REAL,
            originalPrice REAL,
            level TEXT,
            duration TEXT,
            lessons INTEGER,
            image TEXT,
            featured INTEGER DEFAULT 1
        )`);

        // Create Modules table
        await run(`CREATE TABLE IF NOT EXISTS modules (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            courseId INTEGER NOT NULL,
            title TEXT NOT NULL,
            duration TEXT NOT NULL,
            FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE
        )`);

        // Create Progress table
        await run(`CREATE TABLE IF NOT EXISTS progress (
            userId INTEGER NOT NULL,
            courseId INTEGER NOT NULL,
            percent INTEGER DEFAULT 0,
            grade TEXT DEFAULT 'B',
            remarks TEXT,
            PRIMARY KEY (userId, courseId),
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE
        )`);

        // Create Blogs table
        await run(`CREATE TABLE IF NOT EXISTS blogs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            author TEXT NOT NULL,
            date TEXT NOT NULL,
            readTime TEXT NOT NULL,
            summary TEXT NOT NULL,
            content TEXT NOT NULL,
            image TEXT
        )`);

        // Create Timetable table
        await run(`CREATE TABLE IF NOT EXISTS timetable (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            courseId INTEGER NOT NULL,
            topic TEXT NOT NULL,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            instructor TEXT NOT NULL,
            link TEXT NOT NULL,
            FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE
        )`);

        console.log('Database tables verified/created successfully.');
        await seedDatabase();
    } catch (err) {
        console.error('Error initializing database:', err.message);
    }
}

async function seedDatabase() {
    try {
        // 1. Seed Users if table is empty
        const userCountRow = await get('SELECT COUNT(*) AS count FROM users');
        if (userCountRow.count === 0) {
            console.log('Seeding initial users...');
            const defaultUserPassword = await bcrypt.hash('password123', 10);
            const adminPassword = await bcrypt.hash('Shub@140404', 10);

            // Seed Admin
            await run(
                'INSERT INTO users (email, password, name, role, avatar) VALUES (?, ?, ?, ?, ?)',
                ['priyanshupriyesh@gmail.com', adminPassword, 'System Administrator', 'admin', '👑']
            );

            // Seed Marketing
            const marketingPassword = await bcrypt.hash('marketing123', 10);
            await run(
                'INSERT INTO users (email, password, name, role, avatar) VALUES (?, ?, ?, ?, ?)',
                ['marketing@digibookedu.com', marketingPassword, 'Digital Marketing Team', 'marketing', '📢']
            );

            // Seed Teacher
            await run(
                'INSERT INTO users (email, password, name, role, avatar) VALUES (?, ?, ?, ?, ?)',
                ['teacher@digibookedu.com', defaultUserPassword, 'Dr. Sarah Mitchell', 'teacher', '👨‍🏫']
            );

            // Seed Students
            await run(
                'INSERT INTO users (email, password, name, role, avatar) VALUES (?, ?, ?, ?, ?)',
                ['student@digibookedu.com', defaultUserPassword, 'Aarav Patel', 'student', '🎓']
            );
            await run(
                'INSERT INTO users (email, password, name, role, avatar) VALUES (?, ?, ?, ?, ?)',
                ['rohan@gmail.com', defaultUserPassword, 'Rohan Das', 'student', '🎓']
            );
            await run(
                'INSERT INTO users (email, password, name, role, avatar) VALUES (?, ?, ?, ?, ?)',
                ['neha@outlook.com', defaultUserPassword, 'Neha Sharma', 'student', '🎓']
            );

            console.log('Users seeded.');
        }

        // 2. Seed Courses and Modules if empty
        const courseCountRow = await get('SELECT COUNT(*) AS count FROM courses');
        if (courseCountRow.count === 0) {
            console.log('Seeding initial courses and modules...');
            
            const initialCourses = [
                {
                    title: "6-Month Master Diploma in Cybersecurity",
                    category: "Cybersecurity",
                    instructor: "Dr. Sarah Mitchell",
                    rating: 4.9,
                    students: 12450,
                    price: 4999,
                    originalPrice: 9999,
                    level: "Intermediate",
                    duration: "6 months",
                    lessons: 4,
                    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80",
                    featured: 1,
                    modules: [
                        { title: "Fundamentals of Network Architecture & Protocols", duration: "12h" },
                        { title: "Ethical Hacking & Vulnerability Assessment", duration: "16h" },
                        { title: "Cyber Threat Intelligence & Incident Response", duration: "15h" },
                        { title: "Digital Forensics & Corporate Compliance", duration: "18h" }
                    ]
                },
                {
                    title: "Advanced Programming & Software Engineering",
                    category: "Programming",
                    instructor: "Alex Kumar",
                    rating: 4.8,
                    students: 9800,
                    price: 3999,
                    originalPrice: 7999,
                    level: "Advanced",
                    duration: "6 months",
                    lessons: 4,
                    image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=600&q=80",
                    featured: 1,
                    modules: [
                        { title: "Logic Building & Core Programming Paradig paradigms", duration: "15h" },
                        { title: "Data Structures & Algorithmic Efficiency", duration: "18h" },
                        { title: "Full-Stack Architecture & Database Integration", duration: "20h" },
                        { title: "Software Development Life Cycle (SDLC) & Git", duration: "12h" }
                    ]
                }
            ];

            for (const course of initialCourses) {
                const res = await run(
                    `INSERT INTO courses (title, category, instructor, rating, students, price, originalPrice, level, duration, lessons, image, featured)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [course.title, course.category, course.instructor, course.rating, course.students, course.price, course.originalPrice, course.level, course.duration, course.lessons, course.image, course.featured]
                );
                
                const courseId = res.id;
                for (const mod of course.modules) {
                    await run('INSERT INTO modules (courseId, title, duration) VALUES (?, ?, ?)', [courseId, mod.title, mod.duration]);
                }
            }

            console.log('Courses seeded.');
        }

        // 3. Seed Default Enrollments / Student Progress
        const progressCountRow = await get('SELECT COUNT(*) AS count FROM progress');
        if (progressCountRow.count === 0) {
            console.log('Seeding initial student progress...');
            
            // Get student IDs
            const student01 = await get("SELECT id FROM users WHERE email = 'student@digibookedu.com'");
            const student02 = await get("SELECT id FROM users WHERE email = 'rohan@gmail.com'");
            const student03 = await get("SELECT id FROM users WHERE email = 'neha@outlook.com'");

            // Seed progress
            if (student01) {
                await run('INSERT INTO progress (userId, courseId, percent, grade, remarks) VALUES (?, 1, 45, "B+", "Keep working on network security labs! Great enthusiasm.")', [student01.id]);
                await run('INSERT INTO progress (userId, courseId, percent, grade, remarks) VALUES (?, 2, 80, "A", "Excellent job on logic building and frontend structures.")', [student01.id]);
            }
            if (student02) {
                await run('INSERT INTO progress (userId, courseId, percent, grade, remarks) VALUES (?, 1, 92, "A+", "Outstanding grasp of network defense concepts.")', [student02.id]);
                await run('INSERT INTO progress (userId, courseId, percent, grade, remarks) VALUES (?, 2, 60, "B", "Good effort, but review database indexing strategies.")', [student02.id]);
            }
            if (student03) {
                await run('INSERT INTO progress (userId, courseId, percent, grade, remarks) VALUES (?, 2, 75, "A-", "Solid programming implementation and software project.")', [student03.id]);
            }
            console.log('Student progress seeded.');
        }

        // 4. Seed Blogs if empty
        const blogCountRow = await get('SELECT COUNT(*) AS count FROM blogs');
        if (blogCountRow.count === 0) {
            console.log('Seeding initial blogs...');
            const initialBlogs = [
                {
                    title: "10 Crucial Cybersecurity Practices to Implement in 2026",
                    category: "Cybersecurity",
                    author: "Dr. Sarah Mitchell",
                    date: "June 10, 2026",
                    readTime: "5 min read",
                    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80",
                    summary: "Discover the essential security hygiene steps that every organization and developer must adopt to counter modern cyber threat landscapes.",
                    content: "With cyber attacks becoming more sophisticated by the minute, basic security measures are no longer sufficient. In this article, we outline ten major cybersecurity practices ranging from zero-trust architecture, multi-factor authentication, to securing CI/CD pipelines. Staying updated on these principles is critical to preventing costly data breaches..."
                },
                {
                    title: "The Rise of Edge AI: Why Web Developers Should Care",
                    category: "AI & ML",
                    author: "Dr. Priya Sharma",
                    date: "May 28, 2026",
                    readTime: "8 min read",
                    image: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=600&q=80",
                    summary: "Explore how Edge AI is bringing machine learning inference directly to users' browsers and mobile devices, optimizing responsiveness.",
                    content: "Edge AI shifts machine learning computation from remote data centers to edge devices, such as smartphones, smart devices, and browsers. Web developers are now positioned to create highly interactive, low-latency applications with privacy-by-design. We explore WebNN, WebGPU, and lightweight model runtimes for local browser inferencing..."
                },
                {
                    title: "Mastering React 19: New Hooks and Features Explained",
                    category: "Web Development",
                    author: "Alex Kumar",
                    date: "May 15, 2026",
                    readTime: "6 min read",
                    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&q=80",
                    summary: "React 19 introduces major upgrades to forms, actions, and client-server component interactions. Learn how to leverage them today.",
                    content: "React 19 brings exciting improvements including native support for Server Components, action state handlers like useActionState, useOptimistic, and document metadata support. These changes make form submissions and loading states simpler than ever. In this post, we walk through code examples demonstrating the new hooks..."
                }
            ];

            for (const blog of initialBlogs) {
                await run(
                    `INSERT INTO blogs (title, category, author, date, readTime, summary, content, image)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [blog.title, blog.category, blog.author, blog.date, blog.readTime, blog.summary, blog.content, blog.image]
                );
            }
            console.log('Blogs seeded.');
        }

        // 5. Seed Timetable if empty
        const timetableCountRow = await get('SELECT COUNT(*) AS count FROM timetable');
        if (timetableCountRow.count === 0) {
            console.log('Seeding initial timetable...');
            const initialTimetable = [
                {
                    courseId: 1,
                    topic: "Live Q&A: Network Sniffing & WireShark Analysis",
                    date: "June 15, 2026",
                    time: "10:00 AM - 11:30 AM IST",
                    instructor: "Dr. Sarah Mitchell",
                    link: "https://meet.google.com/abc-defg-hij"
                },
                {
                    courseId: 2,
                    topic: "Hands-on Workshop: Custom Hooks & State Sync",
                    date: "June 16, 2026",
                    time: "03:00 PM - 04:30 PM IST",
                    instructor: "Alex Kumar",
                    link: "https://meet.google.com/xyz-pqrs-tuv"
                }
            ];

            for (const tt of initialTimetable) {
                await run(
                    `INSERT INTO timetable (courseId, topic, date, time, instructor, link)
                     VALUES (?, ?, ?, ?, ?, ?)`,
                    [tt.courseId, tt.topic, tt.date, tt.time, tt.instructor, tt.link]
                );
            }
            console.log('Timetable seeded.');
        }

    } catch (err) {
        console.error('Error seeding database:', err.message);
    }
}

module.exports = {
    db,
    run,
    get,
    all
};
