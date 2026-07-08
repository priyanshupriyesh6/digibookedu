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

  // Clear existing courses & modules so changes are always synchronized on start
  await courses.deleteMany({});
  await modules.deleteMany({});
  
  // Reset counters to start IDs from 1
  await collection('counters').updateOne({ _id: 'courses' }, { $set: { seq: 0 } }, { upsert: true });
  await collection('counters').updateOne({ _id: 'modules' }, { $set: { seq: 0 } }, { upsert: true });

  console.log('Seeding courses and modules...');

  const initialCourses = [
    {
      title: 'CEH v12 Pro Course',
      category: 'Cybersecurity',
      instructor: 'Alex Kumar',
      rating: 4.9,
      students: 12450,
      price: 25000,
      originalPrice: 45000,
      level: 'Advanced',
      duration: '40 hours (2 months)',
      lessons: 4,
      image: '/CHEv12pro.jpeg',
      featured: 1,
      segment: 'Advanced Ethical Hacking & Penetration Testing',
      interactiveElement: 'Active Threat Scenario Sandbox',
      actionTrigger: 'Enroll & Claim Lab Pass via WhatsApp',
      overview: 'Master professional ethical hacking with advanced penetration testing methodologies, enterprise security assessments, and real-world attack simulations. Build the skills required to identify, exploit, and secure modern infrastructures using industry-standard tools and techniques. The CEH curriculum covers the full ethical hacking lifecycle, from reconnaissance through reporting, with extensive hands-on practice.',
      headline: 'Advanced Hacking. Professional Penetration Testing.',
      subtext: 'Learn to exploit and secure modern infrastructure with hands-on practice.',
      outcomes: 'Graduates leave with seasoned skills to manage cyber threats and penetration test systems.',
      careerMilestone: 'Prepared for penetration tester and security analyst roles.',
      highlights: [
        'Advanced Network Penetration Testing',
        'Active Directory Security Assessment',
        'Web Application Exploitation',
        'Wireless & Cloud Security',
        'Privilege Escalation Techniques',
        'Malware & Ransomware Analysis',
        'Vulnerability Assessment'
      ],
      tools: [
        'Nmap',
        'Metasploit Framework',
        'SQLmap',
        'Linux Security Tools'
      ],
      skills: [
        'Advanced Reconnaissance',
        'AD Exploitation',
        'Web & Wireless Security',
        'Privilege Escalation',
        'Malware Analysis',
        'Remediation Reporting'
      ],
      modules: [
        { title: 'Module 1: Advanced Network & Active Directory Security: Exploiting domain controllers, routing table manipulations, and AD privilege escalations.', duration: '10h' },
        { title: 'Module 2: Web Application & Wireless Exploitation: Bypassing WAFs, exploiting injection queries, and hijacking wireless traffic.', duration: '10h' },
        { title: 'Module 3: Privilege Escalation & Malware Analysis: Elevating root access on Linux/Windows hosts and inspecting ransomware binaries.', duration: '10h' },
        { title: 'Module 4: Vulnerability Assessment & Penetration Testing: Running network audits, building compliance checks, and writing professional reports.', duration: '10h' }
      ]
    },
    {
      title: 'CHFI (Computer hacking forensic investigator)',
      category: 'Cybersecurity',
      instructor: 'Alex Kumar',
      rating: 4.8,
      students: 9800,
      price: 42000,
      originalPrice: 75000,
      level: 'Advanced',
      duration: '40 Hours (2 Months)',
      lessons: 4,
      image: '/CHFI.jpeg',
      featured: 1,
      segment: 'Digital Forensics & Incident Response',
      interactiveElement: 'Forensic Lab Sandbox & Disk Analyst',
      actionTrigger: 'Enroll & Claim Lab Pass via WhatsApp',
      overview: 'Become a digital forensics specialist by learning how to investigate cyber incidents, recover digital evidence, analyze compromised systems, and prepare legally admissible forensic reports. The CHFI program follows a structured investigation methodology covering evidence acquisition, preservation, analysis, and reporting across Windows, Linux, cloud, mobile, and network environments.',
      headline: 'Investigate Breaches. Recover Evidence. Master Cyber Forensics.',
      subtext: 'Learn structured investigation protocols, disk forensics, and memory analysis.',
      outcomes: 'Become an audit-ready cybercrime investigator and digital evidence specialist.',
      careerMilestone: 'Qualifies for high-paying Digital Forensics Specialist and Incident Responder roles.',
      highlights: [
        'Digital Evidence Collection',
        'Incident Response & Investigation',
        'Windows & Linux Forensics',
        'Network Forensics',
        'Mobile Device Forensics'
      ],
      tools: [
        'Autopsy',
        'FTK Imager',
        'EnCase',
        'Volatility',
        'Wireshark'
      ],
      skills: [
        'Digital Evidence Acquisition',
        'Chain of Custody Management',
        'Disk & Memory Forensics',
        'Malware Investigation',
        'Log Analysis',
        'Incident Response',
        'Cybercrime Investigation',
        'Professional Investigation Reporting'
      ],
      modules: [
        { title: 'Module 1: Digital Evidence Collection & Chain of Custody: Implementing legally admissible evidence collection techniques and tracking logs.', duration: '10h' },
        { title: 'Module 2: Windows & Linux Forensics: Extracting registry details, system logs, and temporal metadata files.', duration: '10h' },
        { title: 'Module 3: Disk, Memory, and Network Forensics: Scanning system RAM buffers, analyzing packet dumps, and reconstructing incident scenes.', duration: '10h' },
        { title: 'Module 4: Mobile Device Forensics & Incident Response: Reconstructing chat logs, app history, and formulating reactive incident response protocols.', duration: '10h' }
      ]
    },
    {
      title: 'Python Learning Program',
      category: 'Programming',
      instructor: 'Alex Kumar',
      rating: 4.8,
      students: 1540,
      price: 15000,
      originalPrice: 28000,
      level: 'Beginner',
      duration: '30 Hours',
      lessons: 4,
      image: '/python.jpeg',
      featured: 1,
      segment: 'Core Software Engineering & Scripts',
      interactiveElement: 'Interactive Coding Console',
      actionTrigger: 'Enroll & Access Coding Labs via WhatsApp',
      overview: 'Master Python programming from scratch. This comprehensive course covers Python fundamentals, object-oriented programming (OOP), file handling, APIs, and automation. Build real-world projects and scripts to automate daily tasks, integrate third-party APIs, and prepare for future AI & Machine Learning paths.',
      headline: 'Code in Python. Automate Workflows. Build Real Projects.',
      subtext: 'A structured, beginner-friendly coding bootcamp covering fundamentals to API integrations.',
      outcomes: 'Students write clean Python code, develop automation scripts, and integrate APIs.',
      careerMilestone: 'Prepares for junior developer, automation tester, and data analyst tracks.',
      highlights: [
        'Python Fundamentals',
        'Variables, Loops & Functions',
        'Object-Oriented Programming (OOP)',
        'File Handling',
        'Exception Handling',
        'Modules & Packages',
        'Data Structures',
        'APIs & JSON',
        'Automation with Python',
        'Mini Real-World Projects'
      ],
      tools: [
        'Python 3',
        'Visual Studio Code',
        'Github & Git'
      ],
      skills: [
        'Python Programming',
        'Problem Solving',
        'Software Development Fundamentals',
        'Automation Scripting',
        'API Integration',
        'Data Manipulation',
        'Debugging Techniques',
        'Project Development'
      ],
      idealFor: [
        'Complete Beginners',
        'School & College Students',
        'Working Professionals',
        'Future AI & ML Engineers',
        'Cybersecurity Aspirants'
      ],
      modules: [
        { title: 'Module 1: Python Fundamentals & Data Structures: Variables, conditionals, loops, functions, lists, dictionaries, and tuples.', duration: '8h' },
        { title: 'Module 2: Object-Oriented Programming (OOP) & File Handling: Structuring classes, inheritance, handling text/JSON files, and exception blocks.', duration: '8h' },
        { title: 'Module 3: APIs, JSON, and Modules: Integrating third-party APIs, querying rest endpoints, and utilizing pip packages.', duration: '7h' },
        { title: 'Module 4: Automation Scripting & Real-World Projects: Writing directory scripts, scraping web elements, and deploying mini projects.', duration: '7h' }
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
      image: '/CEH.jpeg',
      featured: 1,
      segment: 'Advanced Ethical Hacking & Offensive Security',
      interactiveElement: 'Restricted Gated Brochure Intake UI',
      actionTrigger: 'Access Full CEHv12 Resource Syllabus via WhatsApp',
      overview: 'To defeat a hacker, you must be able to think, navigate, and strike exactly like one. The Certified Ethical Hacker (CEHv12) Theory Masterclass is an exhaustive dive into the structural mechanics of modern offensive security. This program systematically breaks down the entire 20-module global standard framework of ethical hacking, guiding students from structural network footprinting right through to advanced system exploitation and cryptography paradigms.',
      headline: 'Think Like a Threat Actor. Architect Defense Like an Expert. Welcome to CEHv12.',
      subtext: 'Master the 20 core domains of the world\'s premier offensive security blueprint and prepare to claim your place among the global elite.',
      outcomes: 'The student completes this masterclass possessing an elite vocabulary and an advanced theoretical mapping of all 20 security domains.',
      careerMilestone: 'This masterclass directly opens the doors to high-paying specialized roles, satisfying the foundational knowledge required for positions such as Information Security Analyst, Incident Responder, and Enterprise Cyber Defense Auditor.',
      highlights: [
        'Ethical Hacking Fundamentals',
        'Footprinting & OSINT',
        'Network Scanning & Enumeration',
        'Vulnerability Assessment',
        'System Hacking Concepts',
        'Malware Analysis'
      ],
      skills: [
        'Network Reconnaissance',
        'Vulnerability Identification',
        'Security Assessment',
        'Linux & Windows Security Basics',
        'Ethical Hacking Methodology',
        'Cyber Defense Concepts',
        'Professional Reporting'
      ],
      modules: [
        { title: 'Module 1: Footprinting, Reconnaissance, and Perimeter Scanning: Utilizing open-source intelligence (OSINT) to map out an enterprise target profile.', duration: '12h' },
        { title: 'Module 2: Vulnerability Analysis & System Hacking: Locating system weaknesses, bypassing authentication systems, and gaining deep root privileges.', duration: '15h' },
        { title: 'Module 3: Web Application & Wireless Network Exploitation: Deconstructing SQL injection vectors, cross-site scripting (XSS), and cracking Wi-Fi encryptions.', duration: '18h' },
        { title: 'Module 4: Perimeter Bypassing & Cloud Hijacking: Evading active Intrusion Detection Systems (IDS), firewalls, honeypots, and securing containerized cloud software.', duration: '14h' }
      ]
    },
    {
      title: 'CEH V12 Basic course',
      category: 'Cybersecurity',
      instructor: 'Alex Kumar',
      rating: 4.9,
      students: 2180,
      price: 25000,
      originalPrice: 45000,
      level: 'Intermediate',
      duration: '40 hours ( 2 months )',
      lessons: 4,
      image: '/CEHv12basic.jpeg',
      featured: 1,
      segment: 'Hands-On Penetration Testing & Lab Simulation',
      interactiveElement: '1:1 Physical Lab Allocation System',
      actionTrigger: 'Reserve Live Workstation Seat via WhatsApp',
      overview: 'Learn the fundamentals of ethical hacking and cybersecurity through the globally recognized CEH methodology. Build a strong understanding of how attackers think, discover vulnerabilities, and secure modern systems using industry-standard tools and techniques.',
      headline: 'Zero Lectures. Pure Execution. Enter the Live Threat Simulation Sandbox.',
      subtext: 'Claim your dedicated 1:1 hardware workstation. Work with over 600 professional security tools to attack and defend real infrastructure.',
      outcomes: 'The student walks out with seasoned, hands-on technical competence. They can sit down at any terminal, fire up a Linux utility, run a deep network audit, and instantly deliver a professional threat remediation report.',
      careerMilestone: 'This deep practical training qualifies graduates to immediately step into high-demand technical roles such as Penetration Tester, Security Engineer, Vulnerability Assessor, and active SOC (Security Operations Center) L1 Analyst.',
      highlights: [
        'Ethical Hacking Fundamentals',
        'Footprinting & OSINT',
        'Network Scanning & Enumeration',
        'Vulnerability Assessment',
        'System Hacking Concepts',
        'Malware Analysis'
      ],
      skills: [
        'Network Reconnaissance',
        'Vulnerability Identification',
        'Security Assessment',
        'Linux & Windows Security Basics',
        'Ethical Hacking Methodology',
        'Cyber Defense Concepts',
        'Professional Reporting'
      ],
      modules: [
        { title: 'Module 1: Live Network Sniffing & Traffic Dissection: Intercepting live data packets using Wireshark and analyzing cleartext credentials across networks.', duration: '10h' },
        { title: 'Module 2: Active Penetration Testing & Exploit Generation: Writing and deploying structural payloads inside test servers using the Metasploit Framework.', duration: '10h' },
        { title: 'Module 3: Automated Password Cracking & Cryptographic Auditing: Using brute-force, dictionary attacks, and rainbow tables to expose weak authorization points.', duration: '10h' },
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
      image: '/CEH.jpeg',
      featured: 1,
      segment: 'Asynchronous Certification Support Utilities',
      interactiveElement: 'Authenticated Student Document Portal',
      actionTrigger: 'Request Access Credentials via WhatsApp',
      overview: 'The final stretch before an international certification exam can be the most intimidating phase of a student\'s educational journey. The CEH Premium Reference Library is a curated, secure archive structured specifically to eliminate examination anxiety and guarantee structural passing scores. This repository acts as an asynchronous knowledge bank, housing comprehensive student manuals, official documentation, step-by-step lab walkthrough notes, and real-world sample question banks.',
      headline: 'Secure Your Passing Score. The Ultimate CEH Candidate Preparation Vault.',
      subtext: 'Instant access to verified reference manuals, mock examination structures, and step-by-step configuration manuals.',
      outcomes: 'The student goes into their international test date with absolute confidence, backed by a proven preparation routine that eliminates exam anxiety.',
      careerMilestone: 'Successfully navigating this final preparation vault directly results in securing the official globally recognized certification, moving candidates past HR filters and straight into technical interview stages.',
      highlights: [
        'Verified Exam Question Simulations',
        'Complete Command Reference Manuals',
        'Visual Lab Workthrough Blueprints',
        'Architectural Blueprint Overviews'
      ],
      skills: [
        'Exam Confidence',
        'Command Quick-reference',
        'Practical review',
        'Architectural mapping'
      ],
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
      image: '/artificailintelligence&pridictivelearnig.jpeg',
      featured: 1,
      segment: 'Next-Generation Machine Learning & Advanced Data Systems',
      interactiveElement: 'Live Code Execution Console Frame',
      actionTrigger: 'Apply for Next Artificial Intelligence Batch via WhatsApp',
      overview: 'Artificial Intelligence is completely rewriting the rules of the global economy. Companies are no longer looking for workers who simply use AI tools—they are competing for engineers who can build, train, and deploy them. The Artificial Intelligence & Predictive Engineering course is a practical look into the software architectures driving this technological shift. Starting from foundational coding mechanics, students learn how to structure complex data streams, clean large analytical blocks, and build predictive machine learning models.',
      headline: 'Don’t Just Prompt AI. Build It. Master the Architecture of Predictive Systems.',
      subtext: 'A comprehensive, code-first introduction to data manipulation, machine learning modules, and automated prediction arrays.',
      outcomes: 'The student finishes the program with a deep, practical understanding of machine learning pipelines. They leave with a personal portfolio of custom prediction engines and automation scripts built from scratch during the course.',
      careerMilestone: 'Graduates stand out in the crowded tech market, fully prepared to pursue high-value modern roles such as Junior AI Developer, Data Integration Engineer, Business Intelligence Analyst, and Automation Architect.',
      highlights: [
        'Foundational Syntax & Data Structuring',
        'Predictive Data Modeling & Engineering Arrays',
        'Training & Deploying Machine Learning Algorithms',
        'Real-World Automation API Integrations'
      ],
      skills: [
        'Data Cleaning',
        'Predictive Classification',
        'Model Deployment',
        'API Integration',
        'Python Scripting'
      ],
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
  
  // Clear progress data to align with new courses re-seeding
  await progress.deleteMany({});
  await collection('counters').updateOne({ _id: 'progress' }, { $set: { seq: 0 } }, { upsert: true });

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
  
  // Clear blogs so they are fresh
  await blogs.deleteMany({});
  await collection('counters').updateOne({ _id: 'blogs' }, { $set: { seq: 0 } }, { upsert: true });

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
  
  // Clear timetable slots
  await timetable.deleteMany({});
  await collection('counters').updateOne({ _id: 'timetable' }, { $set: { seq: 0 } }, { upsert: true });

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
