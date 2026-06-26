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
      segment: 'Core Cyber Security & Data Privacy',
      interactiveElement: 'Active Threat Scenario Sandbox',
      actionTrigger: 'Enroll & Claim Lab Pass via WhatsApp',
      overview: 'Fundamentals of Network Security, Corporate Compliance, Ethical Hacking, Incident Response.',
      headline: 'Secure Your Career. Harden Your Infrastructure.',
      subtext: 'Learn how to defend large scale networks and protect digital assets.',
      outcomes: 'Graduates leave with seasoned skills to manage cyber threats.',
      careerMilestone: 'Prepared for junior cybersecurity analyst roles.',
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
      segment: 'Advanced Software Engineering',
      interactiveElement: 'Live Interactive Coding Workspace',
      actionTrigger: 'Enroll & Access Coding Labs via WhatsApp',
      overview: 'Logic Building, Algorithmic Analysis, Full-Stack Databases, System Architecture.',
      headline: 'Code Like a Pro. Architect Systems Like a Veteran.',
      subtext: 'Master intermediate algorithms and build production-grade fullstack web applications.',
      outcomes: 'Students build a professional developer portfolio.',
      careerMilestone: 'Prepared for fullstack software engineer roles.',
      modules: [
        { title: 'Logic Building & Core Programming Paradigms', duration: '15h' },
        { title: 'Data Structures & Algorithmic Efficiency', duration: '18h' },
        { title: 'Full-Stack Architecture & Database Integration', duration: '20h' },
        { title: 'Software Development Life Cycle (SDLC) & Git', duration: '12h' }
      ]
    },
    {
      title: 'Certified Secure Computer User (CSCU)',
      category: 'Cybersecurity',
      instructor: 'Dr. Sarah Mitchell',
      rating: 4.8,
      students: 1540,
      price: 4999,
      originalPrice: 9999,
      level: 'Beginner',
      duration: '4 Weeks',
      lessons: 4,
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
      featured: 1,
      segment: 'Core Cyber Security & Data Privacy',
      interactiveElement: 'Active Threat Scenario Sandbox',
      actionTrigger: 'Enroll & Claim Lab Pass via WhatsApp',
      overview: 'In an era where data breaches, financial fraud, and identity theft occur every second, digital literacy is no longer just about operating software—it is about tactical survival. The Certified Secure Computer User (CSCU) program is an operational masterclass designed to take individuals with zero security background and turn them into highly resilient digital asset protectors. This program addresses the critical vulnerability gap found in most modern professionals: a lack of awareness regarding sophisticated social engineering, complex malware variations, and data encryption liabilities. Students do not just learn theoretical safety concepts; they actively work with defensive tools to identify vulnerabilities, configure secure networks, and insulate both personal and enterprise infrastructure from malicious actors.',
      headline: 'Protect Your Identity. Secure Your Enterprise. Master the Fundamentals of Digital Defense.',
      subtext: 'A practical, hands-on certification program designed to neutralize modern cyber threats, ransomware, and identity scams before they hit your network.',
      outcomes: 'Upon completion of this module, the student transitions from a vulnerable web user to an audit-ready security asset. They leave with a personalized, hardened security blueprint implemented across their own devices.',
      careerMilestone: 'Graduates are fully prepared to take the global CSCU examination and possess the baseline credentials required for corporate technical support, administrative data management, and junior network asset monitoring roles.',
      modules: [
        { title: 'Module 1: The Modern Threat Landscape & Social Engineering: Identifying phishing hooks, email spoofing, and advanced human-hacking manipulation tactics.', duration: '6h' },
        { title: 'Module 2: Operating System Hardening & Patch Management: Configuring local firewalls, secure user accounts, and continuous automated backup architectures.', duration: '8h' },
        { title: 'Module 3: Network, Wireless, and Cloud Security: Securing home and office Wi-Fi routers, identifying rogue access points, and safely managing cloud storage spaces.', duration: '7h' },
        { title: 'Module 4: Mobile and IoT Device Insulation: Securing smartphones, smart home devices, and tablets against remote data extractions.', duration: '5h' }
      ]
    },
    {
      title: 'Certified Ethical Hacker (CEHv12) — Theory Masterclass',
      category: 'Cybersecurity',
      instructor: 'Alex Kumar',
      rating: 4.9,
      students: 3450,
      price: 7999,
      originalPrice: 15999,
      level: 'Intermediate',
      duration: '8 Weeks',
      lessons: 4,
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
      featured: 1,
      segment: 'Advanced Ethical Hacking & Offensive Security',
      interactiveElement: 'Restricted Gated Brochure Intake UI',
      actionTrigger: 'Access Full CEHv12 Resource Syllabus via WhatsApp',
      overview: 'To defeat a hacker, you must be able to think, navigate, and strike exactly like one. The Certified Ethical Hacker (CEHv12) Theory Masterclass is an exhaustive dive into the structural mechanics of modern offensive security. This program systematically breaks down the entire 20-module global standard framework of ethical hacking, guiding students from structural network footprinting right through to advanced system exploitation and cryptography paradigms. Rather than memorizing abstract concepts, students study the deep logical frameworks behind how networks break, how firewalls are bypassed, and how enterprise architectures are compromised. This forms the absolute baseline of knowledge required by elite penetration testing professionals and global information security analysts.',
      headline: 'Think Like a Threat Actor. Architect Defense Like an Expert. Welcome to CEHv12.',
      subtext: 'Master the 20 core domains of the world\'s premier offensive security blueprint and prepare to claim your place among the global elite.',
      outcomes: 'The student completes this masterclass possessing an elite vocabulary and an advanced theoretical mapping of all 20 security domains. They can walk into any corporate setting and dissect exactly how a network breach occurred.',
      careerMilestone: 'This masterclass directly opens the doors to high-paying specialized roles, satisfying the foundational knowledge required for positions such as Information Security Analyst, Incident Responder, and Enterprise Cyber Defense Auditor.',
      modules: [
        { title: 'Module 1: Footprinting, Reconnaissance, and Perimeter Scanning: Utilizing open-source intelligence (OSINT) to map out an enterprise target profile.', duration: '12h' },
        { title: 'Module 2: Vulnerability Analysis & System Hacking: Locating system weaknesses, bypassing authentication systems, and gaining deep root privileges.', duration: '15h' },
        { title: 'Module 3: Web Application & Wireless Network Exploitation: Deconstructing SQL injection vectors, cross-site scripting (XSS), and cracking Wi-Fi encryptions.', duration: '18h' },
        { title: 'Module 4: Perimeter Bypassing & Cloud Hijacking: Evading active Intrusion Detection Systems (IDS), firewalls, honeypots, and securing containerized cloud software.', duration: '14h' }
      ]
    },
    {
      title: 'CEHv12 Practical Application & Live Lab Blueprint',
      category: 'Cybersecurity',
      instructor: 'Alex Kumar',
      rating: 4.9,
      students: 2180,
      price: 9999,
      originalPrice: 19999,
      level: 'Advanced',
      duration: '6 Weeks',
      lessons: 4,
      image: 'https://images.unsplash.com/photo-1601597111158-2fceff270190?auto=format&fit=crop&w=600&q=80',
      featured: 1,
      segment: 'Hands-On Penetration Testing & Lab Simulation',
      interactiveElement: '1:1 Physical Lab Allocation System',
      actionTrigger: 'Reserve Live Workstation Seat via WhatsApp',
      overview: 'Cyber security is not a spectator sport. You cannot learn to defend a network by looking at slides or reading code from a textbook. The CEHv12 Practical Application & Live Lab Blueprint is an immersive, 100% hands-on laboratory environment where students spend every hour configuring, attacking, and defending real software systems. Operating from our physical facility, each student is allocated a dedicated 1:1 hardware workstation loaded with over 600 official security utilities inside a completely controlled sandbox environment. Under the direct supervision of elite technical mentors, students actively launch real attacks, intercept network traffic, execute brute-force operations, and isolate active malware infections to learn the reality of technical security operations.',
      headline: 'Zero Lectures. Pure Execution. Enter the Live Threat Simulation Sandbox.',
      subtext: 'Claim your dedicated 1:1 hardware workstation. Work with over 600 professional security tools to attack and defend real infrastructure.',
      outcomes: 'The student walks out with seasoned, hands-on technical competence. They can sit down at any terminal, fire up a Linux utility, run a deep network audit, and instantly deliver a professional threat remediation report.',
      careerMilestone: 'This deep practical training qualifies graduates to immediately step into high-demand technical roles such as Penetration Tester, Security Engineer, Vulnerability Assessor, and active SOC (Security Operations Center) L1 Analyst.',
      modules: [
        { title: 'Module 1: Live Network Sniffing & Traffic Dissection: Intercepting live data packets using Wireshark and analyzing cleartext credentials across networks.', duration: '10h' },
        { title: 'Module 2: Active Penetration Testing & Exploit Generation: Writing and deploying structural payloads inside test servers using the Metasploit Framework.', duration: '14h' },
        { title: 'Module 3: Automated Password Cracking & Cryptographic Auditing: Using brute-force, dictionary attacks, and rainbow tables to expose weak authorization points.', duration: '12h' },
        { title: 'Module 4: Incident Response & Firewall Architecture Configuration: Setting up real defensive boundaries, reading logs, and repelling simulated real-time attacks.', duration: '10h' }
      ]
    },
    {
      title: 'CEH Premium Reference Library (Materials & Dumps Vault)',
      category: 'Cybersecurity',
      instructor: 'Alex Kumar',
      rating: 4.7,
      students: 4500,
      price: 2999,
      originalPrice: 5999,
      level: 'Intermediate',
      duration: 'Self-Paced',
      lessons: 4,
      image: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=600&q=80',
      featured: 1,
      segment: 'Asynchronous Certification Support Utilities',
      interactiveElement: 'Authenticated Student Document Portal',
      actionTrigger: 'Request Access Credentials via WhatsApp',
      overview: 'The final stretch before an international certification exam can be the most intimidating phase of a student\'s educational journey. The CEH Premium Reference Library is a curated, secure archive structured specifically to eliminate examination anxiety and guarantee structural passing scores. This repository acts as an asynchronous knowledge bank, housing comprehensive student manuals, official documentation, step-by-step lab walkthrough notes, and real-world sample question banks. This resource vault ensures students never have to waste days searching for reference guidelines or second-guessing their test preparation metrics.',
      headline: 'Secure Your Passing Score. The Ultimate CEH Candidate Preparation Vault.',
      subtext: 'Instant access to verified reference manuals, mock examination structures, and step-by-step configuration manuals.',
      outcomes: 'The student goes into their international test date with absolute confidence, backed by a proven preparation routine that eliminates exam anxiety.',
      careerMilestone: 'Successfully navigating this final preparation vault directly results in securing the official globally recognized certification, moving candidates past HR filters and straight into technical interview stages.',
      modules: [
        { title: 'Module 1: Verified Exam Question Simulations: Deep practice with real-world formatting to understand the logical traps and core question styles of the test.', duration: '8h' },
        { title: 'Module 2: Complete Command Reference Manuals: A quick-reference cheat sheet for all essential Nmap switches, Metasploit parameters, and Linux terminal scripts.', duration: '10h' },
        { title: 'Module 3: Visual Lab Workthrough Blueprints: Comprehensive illustrated guides covering all core practical exercises for easy review away from the lab.', duration: '12h' },
        { title: 'Module 4: Architectural Blueprint Overviews: Summary sheets breaking down the core concepts of every domain for high-impact review sessions.', duration: '6h' }
      ]
    },
    {
      title: 'Artificial Intelligence & Predictive Engineering',
      category: 'Programming',
      instructor: 'Alex Kumar',
      rating: 4.9,
      students: 1800,
      price: 5999,
      originalPrice: 11999,
      level: 'Advanced',
      duration: '8 Weeks',
      lessons: 4,
      image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=600&q=80',
      featured: 1,
      segment: 'Next-Generation Machine Learning & Advanced Data Systems',
      interactiveElement: 'Live Code Execution Console Frame',
      actionTrigger: 'Apply for Next Artificial Intelligence Batch via WhatsApp',
      overview: 'Artificial Intelligence is completely rewriting the rules of the global economy. Companies are no longer looking for workers who simply use AI tools—they are competing for engineers who can build, train, and deploy them. The Artificial Intelligence & Predictive Engineering course is a practical look into the software architectures driving this technological shift. Starting from foundational coding mechanics, students learn how to structure complex data streams, clean large analytical blocks, and build predictive machine learning models. This program cuts through the abstract mathematics to give students a direct, code-first understanding of how modern recommendation algorithms, predictive metrics, and automation layers are designed and integrated into business software.',
      headline: 'Don’t Just Prompt AI. Build It. Master the Architecture of Predictive Systems.',
      subtext: 'A comprehensive, code-first introduction to data manipulation, machine learning modules, and automated prediction arrays.',
      outcomes: 'The student finishes the program with a deep, practical understanding of machine learning pipelines. They leave with a personal portfolio of custom prediction engines and automation scripts built from scratch during the course.',
      careerMilestone: 'Graduates stand out in the crowded tech market, fully prepared to pursue high-value modern roles such as Junior AI Developer, Data Integration Engineer, Business Intelligence Analyst, and Automation Architect.',
      modules: [
        { title: 'Module 1: Foundational Syntax & Data Structuring: Mastering array manipulation, dictionary indexing, and building the pipelines needed to process raw data.', duration: '12h' },
        { title: 'Module 2: Predictive Data Modeling & Engineering Arrays: Using advanced data libraries to extract clean, reliable trends from messy datasets.', duration: '15h' },
        { title: 'Module 3: Training & Deploying Machine Learning Algorithms: Writing predictive classification systems, linear regressions, and baseline clustering models.', duration: '18h' },
        { title: 'Module 4: Real-World Automation API Integrations: Connecting custom-built prediction models into real-world web environments and corporate databases.', duration: '10h' }
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
