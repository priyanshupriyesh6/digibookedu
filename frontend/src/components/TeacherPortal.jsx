import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import logoImg from '../assets/logos/logo.png';

const TeacherPortal = () => {
  const {
    currentUser,
    courses,
    blogs,
    timetable,
    studentProgress,
    mockStudents,
    addCourse,
    updateStudentProgress,
    addBlogPost,
    addTimetableSlot,
    setPortal,
    updateProfile,
    updatePassword,
    logActivity,
    logout
  } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState('overview');

  // Log active tab switching
  useEffect(() => {
    if (logActivity) {
      logActivity('PORTAL_NAVIGATION', `Teacher switched dashboard tab to: "${activeTab}"`);
    }
  }, [activeTab]);

  // Profile Form States
  const [passwordForm, setPasswordForm] = useState({ old: '', new: '', confirm: '' });
  const [passSuccess, setPassSuccess] = useState('');
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editAvatar, setEditAvatar] = useState(currentUser?.avatar || '👨‍🏫');
  const [profileSuccess, setProfileSuccess] = useState('');

  // Course Form State
  const [courseForm, setCourseForm] = useState({
    title: '',
    category: 'Cybersecurity',
    instructor: currentUser?.name || '',
    price: '',
    originalPrice: '',
    level: 'Beginner',
    duration: '12 hours',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
    description: ''
  });
  const [courseSuccess, setCourseSuccess] = useState('');

  // Progress Form State
  const [selectedStudent, setSelectedStudent] = useState(mockStudents[0]?.id || '');
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');
  const [editPercent, setEditPercent] = useState(50);
  const [editGrade, setEditGrade] = useState('B');
  const [editRemarks, setEditRemarks] = useState('');
  const [progressSuccess, setProgressSuccess] = useState('');

  // Blog Form State
  const [blogForm, setBlogForm] = useState({
    title: '',
    category: 'Cybersecurity',
    author: currentUser?.name || '',
    summary: '',
    content: '',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80'
  });
  const [blogSuccess, setBlogSuccess] = useState('');

  // Timetable Form State
  const [timetableForm, setTimetableForm] = useState({
    courseId: courses[0]?.id || '',
    topic: '',
    date: '',
    time: '',
    instructor: currentUser?.name || '',
    link: 'https://meet.google.com/'
  });
  const [timetableSuccess, setTimetableSuccess] = useState('');

  useEffect(() => {
    if (!selectedStudent && mockStudents && mockStudents.length > 0) {
      setSelectedStudent(mockStudents[0].id);
    }
  }, [mockStudents, selectedStudent]);

  useEffect(() => {
    if (!selectedCourseId && courses && courses.length > 0) {
      setSelectedCourseId(courses[0].id);
      setTimetableForm(prev => ({ ...prev, courseId: courses[0].id }));
    }
  }, [courses, selectedCourseId]);

  if (!currentUser || (currentUser.role !== 'teacher' && currentUser.role !== 'admin')) {
    return (
      <div className="min-h-screen bg-surface text-white flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md p-6">
          <span className="text-5xl">🚫</span>
          <h1 className="text-xl font-bold text-danger">Access Denied</h1>
          <p className="text-xs text-surface-300">You must be logged in as an instructor or administrator to view this portal.</p>
          <button onClick={() => setPortal('landing')} className="btn-primary !py-2 !px-4 text-xs">Return to Home Page</button>
        </div>
      </div>
    );
  }

  // Count total students enrolled across all progress cards
  const totalEnrols = Object.values(studentProgress).reduce((acc, curr) => acc + Object.keys(curr).length, 0);

  const handleCreateCourse = (e) => {
    e.preventDefault();
    if (!courseForm.title || !courseForm.price) {
      alert("Please enter title and price.");
      return;
    }
    addCourse({
      ...courseForm,
      price: Number(courseForm.price),
      originalPrice: Number(courseForm.price) * 2
    });
    setCourseSuccess("Course created and published successfully!");
    setCourseForm({
      title: '',
      category: 'Cybersecurity',
      instructor: currentUser.name,
      price: '',
      originalPrice: '',
      level: 'Beginner',
      duration: '12 hours',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
      description: ''
    });
    setTimeout(() => setCourseSuccess(''), 4000);
  };

  const handleUpdateProgress = (e) => {
    e.preventDefault();
    updateStudentProgress(selectedStudent, selectedCourseId, editPercent, editGrade, editRemarks);
    setProgressSuccess("Student progress card updated successfully!");
    setEditRemarks('');
    setTimeout(() => setProgressSuccess(''), 4000);
  };

  const handlePublishBlog = (e) => {
    e.preventDefault();
    if (!blogForm.title || !blogForm.content) {
      alert("Please fill in blog title and content.");
      return;
    }
    addBlogPost(blogForm);
    setBlogSuccess("Blog article published live!");
    setBlogForm({
      title: '',
      category: 'Cybersecurity',
      author: currentUser.name,
      summary: '',
      content: '',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80'
    });
    setTimeout(() => setBlogSuccess(''), 4000);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!editName) {
      alert("Name is required.");
      return;
    }
    const res = await updateProfile(editName, editAvatar);
    if (res.success) {
      setProfileSuccess("Profile details updated successfully!");
      setTimeout(() => setProfileSuccess(''), 4000);
    } else {
      alert(res.message || "Failed to update profile details.");
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      alert("New passwords do not match!");
      return;
    }
    const res = await updatePassword(passwordForm.old, passwordForm.new);
    if (res.success) {
      setPassSuccess("Password updated successfully!");
      setPasswordForm({ old: '', new: '', confirm: '' });
      setTimeout(() => setPassSuccess(''), 4000);
    } else {
      alert(res.message || "Failed to update password.");
    }
  };

  const handleScheduleClass = (e) => {
    e.preventDefault();
    if (!timetableForm.topic || !timetableForm.date || !timetableForm.time) {
      alert("Please fill in lecture details.");
      return;
    }
    const relatedCourse = courses.find(c => c.id === Number(timetableForm.courseId));
    addTimetableSlot({
      ...timetableForm,
      courseId: Number(timetableForm.courseId),
      courseTitle: relatedCourse ? relatedCourse.title : 'General Course'
    });
    setTimetableSuccess("Live lecture slot scheduled!");
    setTimetableForm({
      courseId: courses[0].id,
      topic: '',
      date: '',
      time: '',
      instructor: currentUser.name,
      link: 'https://meet.google.com/'
    });
    setTimeout(() => setTimetableSuccess(''), 4000);
  };

  return (
    <div className="min-h-screen bg-surface text-white flex flex-col md:flex-row">
      
      {/* Portal Sidebar */}
      <aside className="w-full md:w-64 bg-surface-50 border-r border-surface-100/50 flex flex-col p-6 space-y-8 z-10 shrink-0">
        {/* Brand */}
        <div className="flex items-center">
          <img 
            src={logoImg} 
            alt="DigiBookEdu" 
            className="h-10 w-auto object-contain" 
          />
        </div>

        {/* User Badge */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface border border-surface-100/40">
          <div className="w-10 h-10 rounded-xl bg-accent text-surface flex items-center justify-center text-xl font-bold shadow-md">
            {currentUser.avatar || '👨‍🏫'}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-bold truncate leading-snug">{currentUser.name}</h4>
            <p className="text-[10px] text-accent font-semibold leading-none mt-0.5">Teacher Account</p>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 flex flex-col space-y-2">
          {[
            { id: 'overview', label: 'Faculty Overview', icon: '📈' },
            { id: 'courses', label: 'Course Creator & list', icon: '📝' },
            { id: 'progress', label: 'Student Progress Manager', icon: '🏆' },
            { id: 'blogs', label: 'Blog & Picture Publisher', icon: '✍️' },
            { id: 'timetable', label: 'Timetable Scheduler', icon: '📅' },
            { id: 'profile', label: 'Credentials & Profile', icon: '🔑' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-300 ${
                activeTab === item.id 
                  ? 'bg-accent text-surface font-extrabold shadow-lg' 
                  : 'text-surface-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Back to main */}
        <div className="pt-6 border-t border-surface-100/40 space-y-2">
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => setPortal('admin')}
              className="w-full py-2.5 rounded-xl bg-warning/10 hover:bg-warning/20 border border-warning/20 text-warning text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              👑 Admin Console
            </button>
          )}
          <button
            onClick={() => setPortal('landing')}
            className="w-full py-2.5 rounded-xl border border-surface-100 hover:bg-white/5 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
          >
            🌐 Back to main site
          </button>
          <button
            onClick={() => {
              logout();
            }}
            className="w-full py-2.5 rounded-xl bg-danger/10 hover:bg-danger/20 border border-danger/20 text-danger text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* Portal Main Workspace */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        
        {/* VIEW 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-accent/10 via-primary/5 to-transparent border border-surface-100/40 p-6 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white">Instructor Control Panel 👨‍🏫</h1>
                <p className="text-surface-300 text-sm mt-1">Hello {currentUser.name}, edit syllabus details, assign progress grades, and post newsletters.</p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-card p-6 flex items-center justify-between">
                <div>
                  <p className="text-surface-300 text-xs font-semibold uppercase tracking-wider">Total Courses</p>
                  <h3 className="text-2xl font-bold mt-1 text-white">{courses.length} Active</h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary text-xl">📚</div>
              </div>
              
              <div className="glass-card p-6 flex items-center justify-between">
                <div>
                  <p className="text-surface-300 text-xs font-semibold uppercase tracking-wider">Total Enrolled</p>
                  <h3 className="text-2xl font-bold mt-1 text-white">{totalEnrols} Students</h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center text-success text-xl">🎓</div>
              </div>

              <div className="glass-card p-6 flex items-center justify-between">
                <div>
                  <p className="text-surface-300 text-xs font-semibold uppercase tracking-wider">Blogs Published</p>
                  <h3 className="text-2xl font-bold mt-1 text-white">{blogs.length} Posts</h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center text-accent text-xl">✍️</div>
              </div>

              <div className="glass-card p-6 flex items-center justify-between">
                <div>
                  <p className="text-surface-300 text-xs font-semibold uppercase tracking-wider">Live Classes</p>
                  <h3 className="text-2xl font-bold mt-1 text-white">{timetable.length} Scheduled</h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center text-warning text-xl">📅</div>
              </div>
            </div>

            {/* Course & Blog Quick lists */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Courses list */}
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>📝</span> Course Catalog Administration
                </h3>
                <div className="glass-card overflow-hidden border border-surface-100/50">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-surface border-b border-surface-100 text-[10px] font-bold uppercase text-surface-300 tracking-wider">
                        <tr>
                          <th className="p-4">Course Info</th>
                          <th className="p-4">Instructor</th>
                          <th className="p-4">Category</th>
                          <th className="p-4 text-right">Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-100/50">
                        {courses.map(course => (
                          <tr key={course.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 flex items-center gap-3">
                              <img src={course.image} alt={course.title} className="w-9 h-9 rounded-lg object-cover" />
                              <span className="font-bold text-white">{course.title}</span>
                            </td>
                            <td className="p-4 text-surface-300">{course.instructor}</td>
                            <td className="p-4">
                              <span className="badge bg-primary/20 text-primary text-[10px]">{course.category}</span>
                            </td>
                            <td className="p-4 text-right font-extrabold text-white">₹{course.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Blogs list */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>📰</span> Published News & Articles
                </h3>
                <div className="glass-card p-5 space-y-4">
                  {blogs.slice(0, 3).map(blog => (
                    <div key={blog.id} className="flex gap-3 border-b border-surface-100/50 pb-3 last:border-0 last:pb-0 items-start">
                      <img src={blog.image} alt={blog.title} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <h4 className="text-xs font-bold text-white line-clamp-1">{blog.title}</h4>
                        <span className="text-[10px] text-surface-400 mt-0.5 block">{blog.category} • {blog.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: COURSE CREATOR */}
        {activeTab === 'courses' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
                <span>📝</span> Create & Publish Course
              </h1>
              <p className="text-surface-300 text-sm mt-1">Add new educational modules, specify syllabus details, pricing structures and covers.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Creator Form */}
              <div className="lg:col-span-2">
                <div className="glass-card p-6 space-y-6">
                  <h3 className="text-base font-bold text-white">Course Listing Form</h3>
                  {courseSuccess && (
                    <div className="p-3 bg-success/10 border border-success/20 text-success text-xs rounded-xl font-semibold">
                      ✓ {courseSuccess}
                    </div>
                  )}

                  <form onSubmit={handleCreateCourse} className="space-y-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-surface-300 uppercase tracking-wider mb-2">Course Title</label>
                      <input
                        type="text"
                        required
                        value={courseForm.title}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g. Advanced Penetration Testing Masterclass"
                        className="input-field text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-surface-300 uppercase tracking-wider mb-2">Category</label>
                      <select
                        value={courseForm.category}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, category: e.target.value }))}
                        className="input-field text-xs bg-surface-50 text-white"
                      >
                        {['Cybersecurity', 'Web Development', 'Data Science', 'AI & ML', 'Cloud Computing'].map(cat => (
                          <option key={cat} value={cat} className="bg-surface">{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-surface-300 uppercase tracking-wider mb-2">Skill Level</label>
                      <select
                        value={courseForm.level}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, level: e.target.value }))}
                        className="input-field text-xs bg-surface-50 text-white"
                      >
                        {['Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                          <option key={lvl} value={lvl} className="bg-surface">{lvl}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-surface-300 uppercase tracking-wider mb-2">Enrollment Price (₹)</label>
                      <input
                        type="number"
                        required
                        value={courseForm.price}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="e.g. 4999"
                        className="input-field text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-surface-300 uppercase tracking-wider mb-2">Duration Estimation</label>
                      <input
                        type="text"
                        required
                        value={courseForm.duration}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, duration: e.target.value }))}
                        placeholder="e.g. 48 hours"
                        className="input-field text-xs"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-surface-300 uppercase tracking-wider mb-2">Course Image URL</label>
                      <input
                        type="text"
                        required
                        value={courseForm.image}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, image: e.target.value }))}
                        placeholder="e.g. https://images.unsplash.com/photo-..."
                        className="input-field text-xs"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <button type="submit" className="btn-accent !py-2.5 !text-xs !w-full sm:!w-auto">
                        Publish Course Live 🚀
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Cover Preview Card */}
              <div className="lg:col-span-1 space-y-6">
                <h3 className="text-sm font-semibold text-surface-300 uppercase tracking-wider">Live Preview Card</h3>
                <div className="glass-card overflow-hidden hover:shadow-card-hover transition-all duration-300 border border-surface-100">
                  <img src={courseForm.image || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80"} alt="preview" className="h-40 w-full object-cover" />
                  <div className="p-5 space-y-4">
                    <span className="badge bg-primary/20 text-primary uppercase text-[9px] font-black">{courseForm.category}</span>
                    <h4 className="text-sm font-bold text-white leading-tight min-h-[36px]">{courseForm.title || "Untitled Course Title"}</h4>
                    <p className="text-[10px] text-surface-400">Instructor: {courseForm.instructor} • {courseForm.duration}</p>
                    <div className="border-t border-surface-100/50 pt-3 flex items-center justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-black text-white">₹{courseForm.price || '0'}</span>
                        <span className="text-[9px] text-surface-400 line-through">₹{Number(courseForm.price) * 2 || '0'}</span>
                      </div>
                      <span className="text-[10px] bg-accent/20 text-accent font-extrabold px-2 py-0.5 rounded-lg">
                        {courseForm.level}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: STUDENT PROGRESS MANAGER */}
        {activeTab === 'progress' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
                <span>🏆</span> Student Progress & Grading Manager
              </h1>
              <p className="text-surface-300 text-sm mt-1">Review student progress percentages, letter grades, and add feedback remarks.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form panel */}
              <div className="lg:col-span-1">
                <div className="glass-card p-6 space-y-6">
                  <h3 className="text-base font-bold text-white">Edit Progress Card</h3>
                  
                  {progressSuccess && (
                    <div className="p-3 bg-success/10 border border-success/20 text-success text-xs rounded-xl font-semibold">
                      ✓ {progressSuccess}
                    </div>
                  )}

                  <form onSubmit={handleUpdateProgress} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-surface-300 uppercase tracking-wider mb-2">Select Student</label>
                      <select
                        value={selectedStudent}
                        onChange={(e) => setSelectedStudent(e.target.value)}
                        className="input-field text-xs bg-surface-50 text-white"
                      >
                        {mockStudents.map(student => (
                          <option key={student.id} value={student.id} className="bg-surface">{student.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-surface-300 uppercase tracking-wider mb-2">Select Course</label>
                      <select
                        value={selectedCourseId}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                        className="input-field text-xs bg-surface-50 text-white"
                      >
                        {courses.map(course => (
                          <option key={course.id} value={course.id} className="bg-surface">{course.title}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-surface-300 uppercase tracking-wider mb-2 flex justify-between">
                        <span>Completion Percentage</span>
                        <span className="font-extrabold text-white">{editPercent}%</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={editPercent}
                        onChange={(e) => setEditPercent(e.target.value)}
                        className="w-full accent-accent bg-surface-50"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-surface-300 uppercase tracking-wider mb-2">Letter Grade</label>
                      <select
                        value={editGrade}
                        onChange={(e) => setEditGrade(e.target.value)}
                        className="input-field text-xs bg-surface-50 text-white"
                      >
                        {['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D', 'F'].map(grd => (
                          <option key={grd} value={grd} className="bg-surface">{grd}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-surface-300 uppercase tracking-wider mb-2">Instructor Remarks</label>
                      <textarea
                        required
                        rows="3"
                        value={editRemarks}
                        onChange={(e) => setEditRemarks(e.target.value)}
                        placeholder="e.g. Excellent implementation of React. Keep working on the state patterns."
                        className="input-field text-xs"
                      />
                    </div>

                    <button type="submit" className="btn-primary !py-2.5 !text-xs !w-full">
                      Update Student Card 🏆
                    </button>
                  </form>
                </div>
              </div>

              {/* Summary table */}
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-sm font-semibold text-surface-300 uppercase tracking-wider">Student Grading Registry</h3>
                <div className="glass-card overflow-hidden border border-surface-100/50">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-surface border-b border-surface-100 text-[10px] font-bold uppercase tracking-wider text-surface-300">
                        <tr>
                          <th className="p-4">Student</th>
                          <th className="p-4">Enrolled Course</th>
                          <th className="p-4 text-center">Progress %</th>
                          <th className="p-4 text-center">Grade</th>
                          <th className="p-4">Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-100/50">
                        {mockStudents.map(student => {
                          const studentRecs = studentProgress[student.id] || {};
                          return Object.entries(studentRecs).map(([cId, details]) => {
                            const relatedC = courses.find(c => c.id === Number(cId));
                            if (!relatedC) return null;
                            return (
                              <tr key={`${student.id}-${cId}`} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 font-bold text-white flex items-center gap-2">
                                  <div className="w-6 h-6 rounded bg-primary/20 text-primary text-[10px] flex items-center justify-center font-bold">
                                    {student.avatar}
                                  </div>
                                  {student.name}
                                </td>
                                <td className="p-4 text-surface-300 max-w-[150px] truncate">{relatedC.title}</td>
                                <td className="p-4 text-center">
                                  <div className="flex items-center justify-center gap-2">
                                    <span className="font-bold text-white">{details.percent}%</span>
                                    <div className="w-12 bg-surface rounded-full h-1 overflow-hidden hidden sm:block border border-white/5">
                                      <div className="bg-accent h-full" style={{ width: `${details.percent}%` }} />
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4 text-center">
                                  <span className={`font-black px-2 py-0.5 rounded text-[10px] ${
                                    details.grade.startsWith('A') ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
                                  }`}>
                                    {details.grade}
                                  </span>
                                </td>
                                <td className="p-4 text-surface-400 italic max-w-[200px] truncate" title={details.remarks}>
                                  "{details.remarks}"
                                </td>
                              </tr>
                            );
                          });
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: BLOG PUBLISHER */}
        {activeTab === 'blogs' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
                <span>✍️</span> Publish Blog & News Article
              </h1>
              <p className="text-surface-300 text-sm mt-1">Publish student tutorials, cybersecurity newsletters, and platform news.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2">
                <div className="glass-card p-6 space-y-6">
                  <h3 className="text-base font-bold text-white">Create Blog Article</h3>
                  {blogSuccess && (
                    <div className="p-3 bg-success/10 border border-success/20 text-success text-xs rounded-xl font-semibold">
                      ✓ {blogSuccess}
                    </div>
                  )}

                  <form onSubmit={handlePublishBlog} className="space-y-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-surface-300 uppercase tracking-wider mb-2">Blog Title</label>
                      <input
                        type="text"
                        required
                        value={blogForm.title}
                        onChange={(e) => setBlogForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g. Understanding Zero Trust Network Security"
                        className="input-field text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-surface-300 uppercase tracking-wider mb-2">Category</label>
                      <select
                        value={blogForm.category}
                        onChange={(e) => setBlogForm(prev => ({ ...prev, category: e.target.value }))}
                        className="input-field text-xs bg-surface-50 text-white"
                      >
                        {['Cybersecurity', 'Web Development', 'Data Science', 'AI & ML', 'Cloud Computing'].map(cat => (
                          <option key={cat} value={cat} className="bg-surface">{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-surface-300 uppercase tracking-wider mb-2">Image Cover URL</label>
                      <input
                        type="text"
                        required
                        value={blogForm.image}
                        onChange={(e) => setBlogForm(prev => ({ ...prev, image: e.target.value }))}
                        placeholder="e.g. https://images.unsplash.com/photo-..."
                        className="input-field text-xs"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-surface-300 uppercase tracking-wider mb-2">Short Summary</label>
                      <input
                        type="text"
                        required
                        value={blogForm.summary}
                        onChange={(e) => setBlogForm(prev => ({ ...prev, summary: e.target.value }))}
                        placeholder="Brief summary sentence that appears on the card preview..."
                        className="input-field text-xs"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-surface-300 uppercase tracking-wider mb-2">Article Content Body</label>
                      <textarea
                        required
                        rows="8"
                        value={blogForm.content}
                        onChange={(e) => setBlogForm(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Write the detailed article content here..."
                        className="input-field text-xs"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <button type="submit" className="btn-accent !py-2.5 !text-xs !w-full sm:!w-auto">
                        Publish Live News ✍️
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Preview */}
              <div className="lg:col-span-1 space-y-6">
                <h3 className="text-sm font-semibold text-surface-300 uppercase tracking-wider">Blog Card Preview</h3>
                <div className="glass-card overflow-hidden hover:shadow-card-hover transition-all duration-300 border border-surface-100">
                  <img src={blogForm.image} alt="blog cover" className="h-44 w-full object-cover" />
                  <div className="p-5 space-y-3">
                    <span className="badge bg-accent/20 text-accent uppercase text-[9px] font-extrabold">{blogForm.category}</span>
                    <h4 className="text-sm font-bold text-white leading-tight min-h-[36px] line-clamp-2">{blogForm.title || "Untitled Blog Title"}</h4>
                    <p className="text-xs text-surface-300 line-clamp-3 leading-relaxed">{blogForm.summary || "Summary text snippet goes here. Choose custom covers to match."}</p>
                    <div className="border-t border-surface-100/50 pt-3 flex items-center justify-between text-[10px] text-surface-400">
                      <span>By {blogForm.author}</span>
                      <span>Just Now</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: TIMETABLE SCHEDULER */}
        {activeTab === 'timetable' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
                <span>📅</span> Live Timetable Scheduler
              </h1>
              <p className="text-surface-300 text-sm mt-1">Schedule live classes, assign lecture slots and attach meet links.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-1">
                <div className="glass-card p-6 space-y-6">
                  <h3 className="text-base font-bold text-white">Create Schedule Slot</h3>
                  
                  {timetableSuccess && (
                    <div className="p-3 bg-success/10 border border-success/20 text-success text-xs rounded-xl font-semibold">
                      ✓ {timetableSuccess}
                    </div>
                  )}

                  <form onSubmit={handleScheduleClass} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-surface-300 uppercase tracking-wider mb-2">Select Course</label>
                      <select
                        value={timetableForm.courseId}
                        onChange={(e) => setTimetableForm(prev => ({ ...prev, courseId: e.target.value }))}
                        className="input-field text-xs bg-surface-50 text-white"
                      >
                        {courses.map(course => (
                          <option key={course.id} value={course.id} className="bg-surface">{course.title}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-surface-300 uppercase tracking-wider mb-2">Lecture Topic</label>
                      <input
                        type="text"
                        required
                        value={timetableForm.topic}
                        onChange={(e) => setTimetableForm(prev => ({ ...prev, topic: e.target.value }))}
                        placeholder="e.g. Lab: Vulnerability Scanning & WireShark"
                        className="input-field text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-surface-300 uppercase tracking-wider mb-2">Date (e.g. June 20, 2026)</label>
                      <input
                        type="text"
                        required
                        value={timetableForm.date}
                        onChange={(e) => setTimetableForm(prev => ({ ...prev, date: e.target.value }))}
                        placeholder="e.g. June 20, 2026"
                        className="input-field text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-surface-300 uppercase tracking-wider mb-2">Time Slot (e.g. 10:00 AM IST)</label>
                      <input
                        type="text"
                        required
                        value={timetableForm.time}
                        onChange={(e) => setTimetableForm(prev => ({ ...prev, time: e.target.value }))}
                        placeholder="e.g. 10:00 AM - 11:30 AM IST"
                        className="input-field text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-surface-300 uppercase tracking-wider mb-2">Live Meeting Link</label>
                      <input
                        type="text"
                        required
                        value={timetableForm.link}
                        onChange={(e) => setTimetableForm(prev => ({ ...prev, link: e.target.value }))}
                        placeholder="Google Meet or Zoom link..."
                        className="input-field text-xs"
                      />
                    </div>

                    <button type="submit" className="btn-accent !py-2.5 !text-xs !w-full">
                      Schedule Lecture Slot 📅
                    </button>
                  </form>
                </div>
              </div>

              {/* Current List Table */}
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-sm font-semibold text-surface-300 uppercase tracking-wider">Upcoming Scheduled Sessions</h3>
                <div className="glass-card overflow-hidden border border-surface-100/50">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-surface border-b border-surface-100 text-[10px] font-bold uppercase tracking-wider text-surface-300">
                        <tr>
                          <th className="p-4">Course Title</th>
                          <th className="p-4">Lecture Topic</th>
                          <th className="p-4">Date & Time</th>
                          <th className="p-4 text-center">Meet Link</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-100/50">
                        {timetable.map(slot => (
                          <tr key={slot.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 font-bold text-white">{slot.courseTitle}</td>
                            <td className="p-4 text-surface-300">{slot.topic}</td>
                            <td className="p-4 text-white">
                              <div>📅 {slot.date}</div>
                              <div className="text-[10px] text-surface-400 mt-0.5">🕒 {slot.time}</div>
                            </td>
                            <td className="p-4 text-center">
                              <a href={slot.link} target="_blank" rel="noreferrer" className="text-accent hover:underline font-semibold">
                                Link 🔗
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 6: PROFILE & CREDENTIALS */}
        {activeTab === 'profile' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
                <span>🔑</span> Profile & Credentials Manager
              </h1>
              <p className="text-surface-300 text-sm mt-1">Review faculty registry info, active login details, and reset passwords.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Details Card */}
              <div className="lg:col-span-1 space-y-6">
                <h3 className="text-sm font-semibold text-surface-300 uppercase tracking-wider">Registry Credentials</h3>
                <div className="glass-card p-6 space-y-6">
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    {profileSuccess && (
                      <div className="p-3 bg-success/10 border border-success/20 text-success text-[10px] rounded-xl font-semibold">
                        ✓ {profileSuccess}
                      </div>
                    )}
                    <div className="flex flex-col items-center text-center pb-4 border-b border-surface-100">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-bold mb-4 shadow-glow">
                        {editAvatar}
                      </div>
                      <p className="text-xs text-accent font-semibold capitalize mt-1">{currentUser.role} Portal Access</p>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-surface-300 uppercase tracking-wider mb-2">Choose Avatar Emoji</label>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {['🎓', '👨‍🏫', '👑', '💻', '🛡️', '📊', '🚀', '💡', '⚡'].map(emoji => (
                          <button
                            type="button"
                            key={emoji}
                            onClick={() => setEditAvatar(emoji)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg border transition-all ${
                              editAvatar === emoji
                                ? 'bg-accent border-accent text-surface scale-110 shadow-lg'
                                : 'bg-surface-50 border-surface-100 text-surface-300 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-surface-300 uppercase tracking-wider mb-2">Edit Display Name</label>
                      <input
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="input-field text-xs"
                      />
                    </div>

                    <button type="submit" className="w-full btn-accent !py-2.5 !text-xs font-bold">
                      Update Profile Details
                    </button>
                  </form>

                  <div className="space-y-3 border-t border-surface-100/50 pt-4 text-xs">
                    <div>
                      <span className="text-[10px] text-surface-400 font-bold uppercase">Account ID</span>
                      <p className="text-xs text-white font-mono mt-0.5">{currentUser.id}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-surface-400 font-bold uppercase">Registered Email</span>
                      <p className="text-xs text-white mt-0.5">{currentUser.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Password Update */}
              <div className="lg:col-span-2 space-y-8">
                <div className="glass-card p-6 space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>🔒</span> Reset Password Credentials
                  </h3>
                  
                  {passSuccess && (
                    <div className="p-3 bg-success/10 border border-success/20 text-success text-xs rounded-xl font-semibold">
                      ✓ {passSuccess}
                    </div>
                  )}

                  <form onSubmit={handlePasswordReset} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-surface-300 uppercase tracking-wider mb-2">Current Password</label>
                      <input 
                        type="password" 
                        required
                        value={passwordForm.old}
                        onChange={(e) => setPasswordForm(prev => ({...prev, old: e.target.value}))}
                        placeholder="••••••••" 
                        className="input-field text-xs" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-surface-300 uppercase tracking-wider mb-2">New Password</label>
                      <input 
                        type="password" 
                        required
                        value={passwordForm.new}
                        onChange={(e) => setPasswordForm(prev => ({...prev, new: e.target.value}))}
                        placeholder="••••••••" 
                        className="input-field text-xs" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-surface-300 uppercase tracking-wider mb-2">Confirm New Password</label>
                      <input 
                        type="password" 
                        required
                        value={passwordForm.confirm}
                        onChange={(e) => setPasswordForm(prev => ({...prev, confirm: e.target.value}))}
                        placeholder="••••••••" 
                        className="input-field text-xs" 
                      />
                    </div>
                    <div className="sm:col-span-2 pt-2">
                      <button type="submit" className="btn-accent !py-2.5 !text-xs !w-full sm:!w-auto">
                        Update Password Credentials
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default TeacherPortal;
