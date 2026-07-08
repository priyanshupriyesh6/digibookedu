export const courses = [
  {
    id: 1,
    title: "CEH v12 Pro Course",
    category: "Cybersecurity",
    instructor: "Alex Kumar",
    rating: 4.9,
    students: 12450,
    price: 25000,
    originalPrice: 45000,
    level: "Advanced",
    duration: "40 hours (2 months)",
    lessons: 4,
    image: "/CHEv12pro.jpeg",
    featured: true,
    modules: [
      { id: 1, title: "Advanced Network & Active Directory Security", duration: "10h", completed: false },
      { id: 2, title: "Web Application & Wireless Exploitation", duration: "10h", completed: false },
      { id: 3, title: "Privilege Escalation & Malware Analysis", duration: "10h", completed: false },
      { id: 4, title: "Vulnerability Assessment & Penetration Testing", duration: "10h", completed: false }
    ]
  },
  {
    id: 2,
    title: "CHFI (Computer hacking forensic investigator)",
    category: "Cybersecurity",
    instructor: "Alex Kumar",
    rating: 4.8,
    students: 9800,
    price: 42000,
    originalPrice: 75000,
    level: "Advanced",
    duration: "40 Hours (2 Months)",
    lessons: 4,
    image: "/CHFI.jpeg",
    featured: true,
    modules: [
      { id: 1, title: "Digital Evidence Collection & Chain of Custody", duration: "10h", completed: false },
      { id: 2, title: "Windows & Linux Forensics", duration: "10h", completed: false },
      { id: 3, title: "Disk, Memory, and Network Forensics", duration: "10h", completed: false },
      { id: 4, title: "Mobile Device Forensics & Incident Response", duration: "10h", completed: false }
    ]
  },
  {
    id: 3,
    title: "Python Learning Program",
    category: "Programming",
    instructor: "Alex Kumar",
    rating: 4.8,
    students: 1540,
    price: 15000,
    originalPrice: 28000,
    level: "Beginner",
    duration: "30 Hours",
    lessons: 4,
    image: "/python.jpeg",
    featured: true,
    modules: [
      { id: 1, title: "Python Fundamentals & Data Structures", duration: "8h", completed: false },
      { id: 2, title: "Object-Oriented Programming (OOP) & File Handling", duration: "8h", completed: false },
      { id: 3, title: "APIs, JSON, and Modules", duration: "7h", completed: false },
      { id: 4, title: "Automation Scripting & Real-World Projects", duration: "7h", completed: false }
    ]
  },
  {
    id: 4,
    title: "Certified Ethical Hacker (CEHv12) — Theory Masterclass",
    category: "Cybersecurity",
    instructor: "Alex Kumar",
    rating: 4.9,
    students: 3450,
    price: 7999,
    originalPrice: 15999,
    level: "Intermediate",
    duration: "8 Weeks",
    lessons: 4,
    image: "/CEH.jpeg",
    featured: true,
    modules: [
      { id: 1, title: "Footprinting, Reconnaissance, and Scanning", duration: "12h", completed: false },
      { id: 2, title: "Vulnerability Analysis & System Hacking", duration: "15h", completed: false },
      { id: 3, title: "Web Application & Wireless Exploitation", duration: "18h", completed: false },
      { id: 4, title: "Perimeter Bypassing & Cloud Hijacking", duration: "14h", completed: false }
    ]
  },
  {
    id: 5,
    title: "CEH V12 Basic course",
    category: "Cybersecurity",
    instructor: "Alex Kumar",
    rating: 4.9,
    students: 2180,
    price: 25000,
    originalPrice: 45000,
    level: "Intermediate",
    duration: "40 hours ( 2 months )",
    lessons: 4,
    image: "/CEHv12basic.jpeg",
    featured: true,
    modules: [
      { id: 1, title: "Live Network Sniffing & Traffic Dissection", duration: "10h", completed: false },
      { id: 2, title: "Active Penetration Testing & Exploit Generation", duration: "10h", completed: false },
      { id: 3, title: "Automated Password Cracking & Cryptographic Auditing", duration: "10h", completed: false },
      { id: 4, title: "Incident Response & Firewall Configuration", duration: "10h", completed: false }
    ]
  },
  {
    id: 6,
    title: "CEH Premium Reference Library (Materials & Dumps Vault)",
    category: "Cybersecurity",
    instructor: "Alex Kumar",
    rating: 4.7,
    students: 4500,
    price: 2999,
    originalPrice: 5999,
    level: "Intermediate",
    duration: "Self-Paced",
    lessons: 4,
    image: "/CEH.jpeg",
    featured: true,
    modules: [
      { id: 1, title: "Verified Exam Question Simulations", duration: "8h", completed: false },
      { id: 2, title: "Complete Command Reference Manuals", duration: "10h", completed: false },
      { id: 3, title: "Visual Lab Workthrough Blueprints", duration: "12h", completed: false },
      { id: 4, title: "Architectural Blueprint Overviews", duration: "6h", completed: false }
    ]
  },
  {
    id: 7,
    title: "Artificial Intelligence & Predictive Engineering",
    category: "Programming",
    instructor: "Alex Kumar",
    rating: 4.9,
    students: 1800,
    price: 5999,
    originalPrice: 11999,
    level: "Advanced",
    duration: "8 Weeks",
    lessons: 4,
    image: "/artificailintelligence&pridictivelearnig.jpeg",
    featured: true,
    modules: [
      { id: 1, title: "Foundational Syntax & Data Structuring", duration: "12h", completed: false },
      { id: 2, title: "Predictive Data Modeling & Engineering", duration: "15h", completed: false },
      { id: 3, title: "Training & Deploying ML Algorithms", duration: "18h", completed: false },
      { id: 4, title: "Real-World Automation API Integrations", duration: "10h", completed: false }
    ]
  }
];

export const categories = [
  { id: 1, name: "Cybersecurity", icon: "🛡️", count: 12, color: "from-red-500 to-orange-500" },
  { id: 2, name: "Programming", icon: "💻", count: 15, color: "from-blue-500 to-cyan-500" }
];

export const testimonials = [
  {
    id: 1,
    name: "Priya Mehta",
    role: "Cybersecurity Analyst",
    company: "TCS",
    avatar: "PM",
    rating: 5,
    quote: "DigiBookEdu's cybersecurity program completely transformed my career. The hands-on labs and expert instructors made complex concepts incredibly accessible. I landed my dream job within 3 months of completing the course!",
  },
  {
    id: 2,
    name: "Arjun Patel",
    role: "Software Engineer",
    company: "Infosys",
    avatar: "AP",
    rating: 5,
    quote: "The programming track was exactly what I needed. The curriculum is industry-aligned and the logic building sessions gave me real confidence. The 3D interactive learning experience is unlike anything else out there.",
  },
  {
    id: 3,
    name: "Sneha Reddy",
    role: "SecOps Specialist",
    company: "Wipro",
    avatar: "SR",
    rating: 5,
    quote: "I tried several online platforms before DigiBookEdu, and none compare. The live corporate lab tools and cyber defense attack simulations are outstanding. Highly recommended!",
  },
];

export const initialBlogs = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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

export const initialTimetable = [
  {
    id: 1,
    courseId: 1,
    courseTitle: "6-Month Master Diploma in Cybersecurity",
    topic: "Live Q&A: Network Sniffing & WireShark Analysis",
    date: "June 15, 2026",
    time: "10:00 AM - 11:30 AM IST",
    instructor: "Dr. Sarah Mitchell",
    link: "https://meet.google.com/abc-defg-hij"
  },
  {
    id: 2,
    courseId: 2,
    courseTitle: "Advanced Programming & Software Engineering",
    topic: "Hands-on Workshop: Custom Hooks & State Sync",
    date: "June 16, 2026",
    time: "03:00 PM - 04:30 PM IST",
    instructor: "Alex Kumar",
    link: "https://meet.google.com/xyz-pqrs-tuv"
  }
];

export const mockStudents = [
  { id: "student_01", name: "Aarav Patel", email: "student@digibookedu.com", avatar: "AP" },
  { id: "student_02", name: "Rohan Das", email: "rohan@gmail.com", avatar: "RD" },
  { id: "student_03", name: "Neha Sharma", email: "neha@outlook.com", avatar: "NS" }
];
