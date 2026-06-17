export const courses = [
  {
    id: 1,
    title: "Complete Cybersecurity Bootcamp",
    category: "Cybersecurity",
    instructor: "Dr. Sarah Mitchell",
    rating: 4.9,
    students: 12450,
    price: 4999,
    originalPrice: 9999,
    level: "Beginner",
    duration: "48 hours",
    lessons: 12,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80",
    featured: true,
    modules: [
      { id: 1, title: "Introduction to Cybersecurity Landscape", duration: "4h", completed: false },
      { id: 2, title: "Network Security & Protocols", duration: "6h", completed: false },
      { id: 3, title: "Linux Basics & Command Line Tools", duration: "5h", completed: false },
      { id: 4, title: "Introduction to Penetration Testing", duration: "8h", completed: false },
      { id: 5, title: "Cryptography & Data Protection", duration: "7h", completed: false },
      { id: 6, title: "Incident Response & Forensics Basics", duration: "8h", completed: false }
    ]
  },
  {
    id: 2,
    title: "Full-Stack Web Development with React",
    category: "Web Development",
    instructor: "Alex Kumar",
    rating: 4.8,
    students: 9800,
    price: 3999,
    originalPrice: 7999,
    level: "Intermediate",
    duration: "56 hours",
    lessons: 14,
    image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=600&q=80",
    featured: true,
    modules: [
      { id: 1, title: "HTML5, CSS3, and Responsive Layouts", duration: "5h", completed: false },
      { id: 2, title: "Modern JavaScript (ES6+)", duration: "6h", completed: false },
      { id: 3, title: "React Basics: JSX, Props & State", duration: "8h", completed: false },
      { id: 4, title: "State Management: Context API & Redux", duration: "10h", completed: false },
      { id: 5, title: "Building APIs with Node.js & Express", duration: "12h", completed: false },
      { id: 6, title: "Database Integration: MongoDB & SQL", duration: "10h", completed: false }
    ]
  },
  {
    id: 3,
    title: "Data Science & Machine Learning Masterclass",
    category: "Data Science",
    instructor: "Prof. Ananya Rao",
    rating: 4.7,
    students: 8200,
    price: 5999,
    originalPrice: 11999,
    level: "Advanced",
    duration: "64 hours",
    lessons: 16,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
    featured: true,
    modules: [
      { id: 1, title: "Python for Data Analysis (Pandas & NumPy)", duration: "8h", completed: false },
      { id: 2, title: "Data Visualization (Matplotlib & Seaborn)", duration: "6h", completed: false },
      { id: 3, title: "Statistical Analysis & Probability Basics", duration: "10h", completed: false },
      { id: 4, title: "Supervised Learning: Regression & Classification", duration: "12h", completed: false },
      { id: 5, title: "Unsupervised Learning: Clustering & PCA", duration: "10h", completed: false },
      { id: 6, title: "Introduction to Neural Networks & TensorFlow", duration: "14h", completed: false }
    ]
  },
  {
    id: 4,
    title: "Ethical Hacking & Penetration Testing",
    category: "Cybersecurity",
    instructor: "Rajesh Verma",
    rating: 4.9,
    students: 7500,
    price: 4499,
    originalPrice: 8999,
    level: "Intermediate",
    duration: "40 hours",
    lessons: 10,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
    featured: true,
    modules: [
      { id: 1, title: "Introduction to Ethical Hacking", duration: "4h", completed: false },
      { id: 2, title: "Reconnaissance & Footprinting", duration: "6h", completed: false },
      { id: 3, title: "Scanning Networks & Enumeration", duration: "8h", completed: false },
      { id: 4, title: "System Hacking & Vulnerability Analysis", duration: "8h", completed: false },
      { id: 5, title: "Web Application Pen Testing", duration: "8h", completed: false },
      { id: 6, title: "Wireless & IoT Network Security", duration: "6h", completed: false }
    ]
  },
  {
    id: 5,
    title: "AI & Deep Learning with Python",
    category: "AI & ML",
    instructor: "Dr. Priya Sharma",
    rating: 4.8,
    students: 6300,
    price: 5499,
    originalPrice: 10999,
    level: "Advanced",
    duration: "52 hours",
    lessons: 13,
    image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=600&q=80",
    featured: true,
    modules: [
      { id: 1, title: "Introduction to Artificial Intelligence", duration: "4h", completed: false },
      { id: 2, title: "Deep Learning Foundations (Neurons & Layers)", duration: "8h", completed: false },
      { id: 3, title: "Convolutional Neural Networks (CNN) for Computer Vision", duration: "10h", completed: false },
      { id: 4, title: "Recurrent Neural Networks (RNN) & LSTM for NLP", duration: "10h", completed: false },
      { id: 5, title: "Generative AI & LLMs (Transformers)", duration: "12h", completed: false },
      { id: 6, title: "Deploying AI Models to Production", duration: "8h", completed: false }
    ]
  },
  {
    id: 6,
    title: "Cloud Computing with AWS & Azure",
    category: "Cloud Computing",
    instructor: "Vikram Singh",
    rating: 4.6,
    students: 5400,
    price: 3499,
    originalPrice: 6999,
    level: "Beginner",
    duration: "36 hours",
    lessons: 9,
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80",
    featured: true,
    modules: [
      { id: 1, title: "Cloud Fundamentals & Virtualization", duration: "4h", completed: false },
      { id: 2, title: "Amazon Web Services (AWS) Core Services", duration: "8h", completed: false },
      { id: 3, title: "Microsoft Azure Core Services", duration: "8h", completed: false },
      { id: 4, title: "Cloud Security, IAM, and Networking", duration: "6h", completed: false },
      { id: 5, title: "Cloud Storage Solutions & Database Options", duration: "6h", completed: false },
      { id: 6, title: "DevOps & Serverless Architecture in Cloud", duration: "4h", completed: false }
    ]
  }
];

export const categories = [
  { id: 1, name: "Cybersecurity", icon: "🛡️", count: 45, color: "from-red-500 to-orange-500" },
  { id: 2, name: "Web Development", icon: "🌐", count: 62, color: "from-blue-500 to-cyan-500" },
  { id: 3, name: "Data Science", icon: "📊", count: 38, color: "from-green-500 to-emerald-500" },
  { id: 4, name: "AI & ML", icon: "🤖", count: 29, color: "from-purple-500 to-pink-500" },
  { id: 5, name: "Cloud Computing", icon: "☁️", count: 24, color: "from-sky-500 to-blue-500" },
  { id: 6, name: "Digital Forensics", icon: "🔍", count: 18, color: "from-amber-500 to-yellow-500" },
  { id: 7, name: "Mobile Development", icon: "📱", count: 33, color: "from-teal-500 to-cyan-500" },
  { id: 8, name: "DevOps", icon: "⚙️", count: 21, color: "from-indigo-500 to-violet-500" },
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
    role: "Full-Stack Developer",
    company: "Infosys",
    avatar: "AP",
    rating: 5,
    quote: "The web development bootcamp was exactly what I needed. The curriculum is industry-aligned and the projects gave me real confidence. The 3D interactive learning experience is unlike anything else out there.",
  },
  {
    id: 3,
    name: "Sneha Reddy",
    role: "Data Scientist",
    company: "Wipro",
    avatar: "SR",
    rating: 5,
    quote: "I tried several online platforms before DigiBookEdu, and none compare. The data science masterclass is comprehensive, well-structured, and the community support is outstanding. Highly recommended!",
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
    courseTitle: "Complete Cybersecurity Bootcamp",
    topic: "Live Q&A: Network Sniffing & WireShark Analysis",
    date: "June 15, 2026",
    time: "10:00 AM - 11:30 AM IST",
    instructor: "Dr. Sarah Mitchell",
    link: "https://meet.google.com/abc-defg-hij"
  },
  {
    id: 2,
    courseId: 2,
    courseTitle: "Full-Stack Web Development with React",
    topic: "Hands-on Workshop: Custom Hooks & State Sync",
    date: "June 16, 2026",
    time: "03:00 PM - 04:30 PM IST",
    instructor: "Alex Kumar",
    link: "https://meet.google.com/xyz-pqrs-tuv"
  },
  {
    id: 3,
    courseId: 3,
    courseTitle: "Data Science & Machine Learning Masterclass",
    topic: "Practical Lab: Tuning Hyperparameters for Random Forests",
    date: "June 18, 2026",
    time: "11:00 AM - 12:30 PM IST",
    instructor: "Prof. Ananya Rao",
    link: "https://meet.google.com/klm-nopq-rst"
  }
];

export const mockStudents = [
  { id: "student_01", name: "Aarav Patel", email: "student@digibookedu.com", avatar: "AP" },
  { id: "student_02", name: "Rohan Das", email: "rohan@gmail.com", avatar: "RD" },
  { id: "student_03", name: "Neha Sharma", email: "neha@outlook.com", avatar: "NS" }
];
