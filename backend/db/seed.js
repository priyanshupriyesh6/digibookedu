const bcrypt = require('bcryptjs');

let collection;
let getNextId;

async function seedDatabase(helpers) {
  collection = helpers.collection;
  getNextId = helpers.getNextId;

  await seedUsers();
  await seedCoursesAndModules();
  await seedProgress();
  await seedBlogs();
  await seedTimetable();
}

async function seedUsers() {
  const users = collection('users');
  const count = await users.countDocuments();
  if (count > 0) return;

  console.log('Seeding users...');

  const defaultPassword = await bcrypt.hash('password123', 10);
  const adminPassword = await bcrypt.hash('Shub@140404', 10);
  const marketingPassword = await bcrypt.hash('marketing123', 10);

  const initialUsers = [
    { email: 'priyanshupriyesh@gmail.com', password: adminPassword, name: 'System Administrator', role: 'admin', avatar: '👑' },
    { email: 'marketing@digibookedu.com', password: marketingPassword, name: 'Digital Marketing Team', role: 'marketing', avatar: '📢' },
    { email: 'teacher@digibookedu.com', password: defaultPassword, name: 'Dr. Sarah Mitchell', role: 'teacher', avatar: '👨‍🏫' },
    { email: 'student@digibookedu.com', password: defaultPassword, name: 'Aarav Patel', role: 'student', avatar: '🎓' },
    { email: 'rohan@gmail.com', password: defaultPassword, name: 'Rohan Das', role: 'student', avatar: '🎓' },
    { email: 'neha@outlook.com', password: defaultPassword, name: 'Neha Sharma', role: 'student', avatar: '🎓' }
  ];

  for (const user of initialUsers) {
    const id = await getNextId('users');
    await users.insertOne({ id, ...user });
  }
}

async function seedCoursesAndModules() {
  const courses = collection('courses');
  const modules = collection('modules');
  const count = await courses.countDocuments();
  if (count > 0) return;

  console.log('Seeding courses and modules...');

  const initialCourses = [
    {
      title: '6-Month Master Diploma in Cybersecurity',
      category: 'Cybersecurity',
      instructor: 'Dr. Sarah Mitchell',
      rating: 4.9,
      students: 12450,
      price: 4999,
      originalPrice: 9999,
      level: 'Intermediate',
      duration: '6 months',
      lessons: 4,
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
      featured: 1,
      modules: [
        { title: 'Fundamentals of Network Architecture & Protocols', duration: '12h' },
        { title: 'Ethical Hacking & Vulnerability Assessment', duration: '16h' },
        { title: 'Cyber Threat Intelligence & Incident Response', duration: '15h' },
        { title: 'Digital Forensics & Corporate Compliance', duration: '18h' }
      ]
    },
    {
      title: 'Advanced Programming & Software Engineering',
      category: 'Programming',
      instructor: 'Alex Kumar',
      rating: 4.8,
      students: 9800,
      price: 3999,
      originalPrice: 7999,
      level: 'Advanced',
      duration: '6 months',
      lessons: 4,
      image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=600&q=80',
      featured: 1,
      modules: [
        { title: 'Logic Building & Core Programming Paradig paradigms', duration: '15h' },
        { title: 'Data Structures & Algorithmic Efficiency', duration: '18h' },
        { title: 'Full-Stack Architecture & Database Integration', duration: '20h' },
        { title: 'Software Development Life Cycle (SDLC) & Git', duration: '12h' }
      ]
    }
  ];

  for (const course of initialCourses) {
    const id = await getNextId('courses');
    await courses.insertOne({ id, ...course });

    for (const module of course.modules) {
      const moduleId = await getNextId('modules');
      await modules.insertOne({ id: moduleId, courseId: id, ...module });
    }
  }
}

async function seedProgress() {
  const progress = collection('progress');
  const count = await progress.countDocuments();
  if (count > 0) return;

  console.log('Seeding progress...');

  const student01 = await collection('users').findOne({ email: 'student@digibookedu.com' });
  const student02 = await collection('users').findOne({ email: 'rohan@gmail.com' });
  const student03 = await collection('users').findOne({ email: 'neha@outlook.com' });

  const entries = [];
  if (student01) {
    entries.push({ userId: student01.id, courseId: 1, percent: 45, grade: 'B+', remarks: 'Keep working on network security labs! Great enthusiasm.' });
    entries.push({ userId: student01.id, courseId: 2, percent: 80, grade: 'A', remarks: 'Excellent job on logic building and frontend structures.' });
  }
  if (student02) {
    entries.push({ userId: student02.id, courseId: 1, percent: 92, grade: 'A+', remarks: 'Outstanding grasp of network defense concepts.' });
    entries.push({ userId: student02.id, courseId: 2, percent: 60, grade: 'B', remarks: 'Good effort, but review database indexing strategies.' });
  }
  if (student03) {
    entries.push({ userId: student03.id, courseId: 2, percent: 75, grade: 'A-', remarks: 'Solid programming implementation and software project.' });
  }

  if (entries.length > 0) {
    const documents = [];
    for (const entry of entries) {
      const id = await getNextId('progress');
      documents.push({ id, ...entry });
    }
    await progress.insertMany(documents);
  }
}

async function seedBlogs() {
  const blogs = collection('blogs');
  const count = await blogs.countDocuments();
  if (count > 0) return;

  console.log('Seeding blogs...');

  await blogs.insertMany([
    {
      id: await getNextId('blogs'),
      title: 'How to Start a Career in Ethical Hacking',
      category: 'Cybersecurity',
      author: 'Dr. Sarah Mitchell',
      date: 'August 1, 2025',
      readTime: '6 min read',
      summary: 'A beginner-friendly roadmap to becoming an ethical hacker, including certifications, tools, and first steps.',
      content: 'Ethical hacking opens doors to protecting systems before they are exploited by malicious attackers... [trimmed for brevity]',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: await getNextId('blogs'),
      title: 'Modern Web Development Career Paths in 2026',
      category: 'Programming',
      author: 'Alex Kumar',
      date: 'July 15, 2025',
      readTime: '5 min read',
      summary: 'Explore how full-stack, DevOps, and low-code roles are shaping the next generation of web careers.',
      content: 'The web development landscape continues to evolve rapidly with new frameworks, cloud services, and remote team models... [trimmed for brevity]',
      image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=600&q=80'
    }
  ]);
}

async function seedTimetable() {
  const timetable = collection('timetable');
  const count = await timetable.countDocuments();
  if (count > 0) return;

  console.log('Seeding timetable...');

  await timetable.insertMany([
    {
      id: await getNextId('timetable'),
      courseId: 1,
      topic: 'Network Security Workshop',
      date: 'September 05, 2025',
      time: '10:00 AM',
      instructor: 'Dr. Sarah Mitchell',
      link: 'https://meet.google.com/'
    },
    {
      id: await getNextId('timetable'),
      courseId: 2,
      topic: 'Modern Full-Stack Practices',
      date: 'September 12, 2025',
      time: '2:00 PM',
      instructor: 'Alex Kumar',
      link: 'https://meet.google.com/'
    }
  ]);
}

module.exports = { seedDatabase };
