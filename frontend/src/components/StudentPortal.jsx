import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';

const StudentPortal = () => {
  const { 
    currentUser, 
    courses, 
    timetable, 
    studentProgress, 
    toggleModuleComplete, 
    setPortal,
    updateProfile,
    updatePassword,
    logActivity
  } = useContext(AppContext);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCourse, setSelectedCourse] = useState(courses[0]);
  const [passwordForm, setPasswordForm] = useState({ old: '', new: '', confirm: '' });
  const [passSuccess, setPassSuccess] = useState('');
  
  // Profile settings state
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editAvatar, setEditAvatar] = useState(currentUser?.avatar || '🎓');
  const [profileSuccess, setProfileSuccess] = useState('');

  // Log active tab switching
  useEffect(() => {
    if (logActivity) {
      logActivity('PORTAL_NAVIGATION', `Student switched dashboard tab to: "${activeTab}"`);
    }
  }, [activeTab]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-surface text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-sm text-surface-300">Not authenticated. Please log in.</p>
          <button onClick={() => setPortal('landing')} className="btn-primary !py-2 !px-4 text-xs">Go to Home Page</button>
        </div>
      </div>
    );
  }

  // Get active student progress
  const progressData = studentProgress[currentUser.id] || {};

  // Calculate overall metrics
  const enrolledCourses = courses.filter(c => progressData[c.id] !== undefined);
  const averageProgress = enrolledCourses.length > 0 
    ? Math.round(enrolledCourses.reduce((acc, curr) => acc + (progressData[curr.id]?.percent || 0), 0) / enrolledCourses.length) 
    : 0;

  const handleCompleteModule = (courseId, moduleId) => {
    toggleModuleComplete(currentUser.id, courseId, moduleId);
    // Refresh selected course details
    setSelectedCourse(prev => ({...prev}));
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

  return (
    <div className="min-h-screen bg-surface text-white flex flex-col md:flex-row">
      {/* Portal Sidebar */}
      <aside className="w-full md:w-64 bg-surface-50 border-r border-surface-100/50 flex flex-col p-6 space-y-8 z-10 shrink-0">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-base">
            D
          </div>
          <span className="text-lg font-bold gradient-text">DigiBookEdu</span>
        </div>

        {/* User Badge */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface border border-surface-100/40">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-sm">
            🎓
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-bold truncate leading-snug">{currentUser.name}</h4>
            <p className="text-[10px] text-surface-300 font-semibold leading-none mt-0.5">Student Account</p>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 flex flex-col space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard Workspace', icon: '📊' },
            { id: 'courses', label: 'My Courses & Modules', icon: '📚' },
            { id: 'progress', label: 'Report & Progress Card', icon: '🎓' },
            { id: 'timetable', label: 'Timetable & Lessons', icon: '📅' },
            { id: 'profile', label: 'Credentials & Profile', icon: '🔑' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-300 ${
                activeTab === item.id 
                  ? 'bg-primary text-white shadow-glow' 
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
          <button
            onClick={() => setPortal('landing')}
            className="w-full py-2.5 rounded-xl border border-surface-100 hover:bg-white/5 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
          >
            🌐 Back to main site
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('digi_user');
              window.location.reload();
            }}
            className="w-full py-2.5 rounded-xl bg-danger/10 hover:bg-danger/20 border border-danger/20 text-danger text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* Portal Main Workspace */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        
        {/* VIEW 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-primary/10 via-accent/5 to-transparent border border-surface-100/40 p-6 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white">Welcome back, {currentUser.name}! 👋</h1>
                <p className="text-surface-300 text-sm mt-1">Check your latest lessons, timetable slots, and grading card comments.</p>
              </div>
              <div className="bg-primary/20 border border-primary/30 px-4 py-2 rounded-2xl flex items-center gap-3">
                <span className="text-xl">🔥</span>
                <div>
                  <h4 className="text-xs font-bold leading-none text-white">Streak Active</h4>
                  <p className="text-[10px] text-primary-200 mt-1 font-semibold">5 Days Learning</p>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="glass-card p-6 flex items-center justify-between">
                <div>
                  <p className="text-surface-300 text-xs font-semibold uppercase tracking-wider">Courses Enrolled</p>
                  <h3 className="text-2xl font-bold mt-1">{enrolledCourses.length} Courses</h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary text-xl">📚</div>
              </div>
              
              <div className="glass-card p-6 flex items-center justify-between">
                <div>
                  <p className="text-surface-300 text-xs font-semibold uppercase tracking-wider">Average Progress</p>
                  <h3 className="text-2xl font-bold mt-1">{averageProgress}% Complete</h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center text-success text-xl">📈</div>
              </div>

              <div className="glass-card p-6 flex items-center justify-between col-span-1 sm:col-span-2 lg:col-span-1">
                <div>
                  <p className="text-surface-300 text-xs font-semibold uppercase tracking-wider">Next Live Class</p>
                  <h3 className="text-sm font-bold mt-1 truncate max-w-[200px]">
                    {timetable.length > 0 ? timetable[0].topic : "No classes scheduled"}
                  </h3>
                  <p className="text-[10px] text-surface-400 mt-0.5">{timetable.length > 0 ? timetable[0].time : ""}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center text-warning text-xl">📅</div>
              </div>
            </div>

            {/* Timetable Overview & Current Courses */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Enrolled Courses Progress */}
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>🎯</span> Enrolled Courses & Quick Modules
                </h3>
                <div className="space-y-4">
                  {enrolledCourses.map(course => {
                    const pct = progressData[course.id]?.percent || 0;
                    return (
                      <div 
                        key={course.id}
                        onClick={() => {
                          setSelectedCourse(course);
                          setActiveTab('courses');
                          if (logActivity) logActivity('CLICK', `Student clicked course details for: "${course.title}"`);
                        }}
                        className="glass-card p-5 hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <img 
                            src={course.image} 
                            alt={course.title} 
                            className="w-14 h-14 rounded-xl object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors">{course.title}</h4>
                            <p className="text-xs text-surface-300 mt-0.5">Instructor: {course.instructor}</p>
                            
                            {/* Progress bar */}
                            <div className="w-full bg-surface/50 rounded-full h-1.5 mt-3 overflow-hidden border border-white/5">
                              <div 
                                className="bg-primary h-full rounded-full transition-all duration-500" 
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="ml-6 text-right">
                          <span className="text-sm font-extrabold text-white">{pct}%</span>
                          <p className="text-[10px] text-surface-400 mt-0.5 uppercase tracking-wider font-semibold">Progress</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Timetable sidebar */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>⏰</span> Today's Lectures
                </h3>
                <div className="glass-card p-6 space-y-4">
                  {timetable.length > 0 ? (
                    timetable.slice(0, 2).map(slot => (
                      <div key={slot.id} className="border-b border-surface-100 last:border-0 pb-4 last:pb-0 space-y-2">
                        <span className="inline-block px-2 py-0.5 rounded-lg bg-primary/20 text-primary text-[10px] font-bold">
                          {slot.courseTitle.split(' ')[0]}
                        </span>
                        <h4 className="text-xs font-bold text-white leading-tight">{slot.topic}</h4>
                        <p className="text-[10px] text-surface-300 flex items-center gap-1">
                          <span>📅</span> {slot.date}
                        </p>
                        <p className="text-[10px] text-surface-300 flex items-center gap-1">
                          <span>🕒</span> {slot.time}
                        </p>
                        <a 
                          href={slot.link} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-block mt-2 text-[10px] font-bold text-accent hover:underline flex items-center gap-1"
                        >
                          Join Live Video Class 🔗
                        </a>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-surface-300">No upcoming live sessions.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: MY COURSES & MODULES */}
        {activeTab === 'courses' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
                <span>📚</span> Course Syllabus & Modules
              </h1>
              <p className="text-surface-300 text-sm mt-1">Study lecture videos, read articles, and tick modules to track progress.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Courses list */}
              <div className="lg:col-span-1 space-y-4">
                <h3 className="text-sm font-semibold text-surface-300 uppercase tracking-wider">Your Active Courses</h3>
                <div className="space-y-3">
                  {enrolledCourses.map(course => (
                    <button
                      key={course.id}
                      onClick={() => setSelectedCourse(course)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center gap-3 ${
                        selectedCourse.id === course.id
                          ? 'bg-primary/10 border-primary shadow-glow'
                          : 'bg-surface-50 border-surface-100 hover:bg-white/5'
                      }`}
                    >
                      <img src={course.image} alt={course.title} className="w-10 h-10 rounded-lg object-cover" />
                      <div className="overflow-hidden">
                        <h4 className="text-xs font-bold text-white truncate leading-snug">{course.title}</h4>
                        <p className="text-[10px] text-surface-300 truncate mt-0.5">{course.category}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Modules details */}
              <div className="lg:col-span-2 space-y-6">
                {selectedCourse ? (
                  <div className="space-y-6">
                    {/* Course Header */}
                    <div className="glass-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="badge bg-primary/20 text-primary mb-2">{selectedCourse.category}</span>
                        <h2 className="text-xl font-bold text-white">{selectedCourse.title}</h2>
                        <p className="text-xs text-surface-300 mt-1">Instructor: {selectedCourse.instructor} • {selectedCourse.duration}</p>
                      </div>
                      <div className="text-center sm:text-right">
                        <h3 className="text-2xl font-extrabold text-white">{progressData[selectedCourse.id]?.percent || 0}%</h3>
                        <p className="text-[10px] text-surface-400 font-semibold uppercase tracking-wider">Completed</p>
                      </div>
                    </div>

                    {/* Modules Checklist */}
                    <div className="space-y-4">
                      <h3 className="text-base font-bold text-white">Syllabus Chapters ({selectedCourse.modules?.length || 6})</h3>
                      <div className="space-y-3">
                        {(selectedCourse.modules || []).map((mod, index) => {
                          const pct = progressData[selectedCourse.id]?.percent || 0;
                          const total = selectedCourse.modules?.length || 6;
                          const step = 100 / total;
                          // Check if module is completed based on current percentage
                          const isCompleted = pct >= (index + 1) * step;

                          return (
                            <div 
                              key={mod.id}
                              className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
                                isCompleted
                                  ? 'bg-success/5 border-success/20'
                                  : 'bg-surface-50 border-surface-100/50'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => handleCompleteModule(selectedCourse.id, mod.id)}
                                  disabled={isCompleted}
                                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                                    isCompleted
                                      ? 'bg-success text-white'
                                      : 'border border-surface-200 hover:border-primary text-transparent'
                                  }`}
                                >
                                  ✓
                                </button>
                                <div>
                                  <h4 className={`text-xs font-bold ${isCompleted ? 'text-surface-400 line-through' : 'text-white'}`}>
                                    {mod.title}
                                  </h4>
                                  <p className="text-[10px] text-surface-400 mt-0.5">Est. Study: {mod.duration}</p>
                                </div>
                              </div>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase ${
                                isCompleted ? 'bg-success/20 text-success' : 'bg-surface-100 text-surface-400'
                              }`}>
                                {isCompleted ? 'Completed' : 'Pending'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="glass-card p-12 text-center">
                    <p className="text-sm text-surface-300">Select an active course on the left to review its syllabus.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: PROGRESS CARD */}
        {activeTab === 'progress' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
                <span>🎓</span> Student Progress & Grading Card
              </h1>
              <p className="text-surface-300 text-sm mt-1">Review official test scores, course completions, and teacher evaluations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {enrolledCourses.map(course => {
                const card = progressData[course.id] || { percent: 0, grade: 'C', remarks: 'No reports yet.' };
                return (
                  <div key={course.id} className="glass-card p-6 flex flex-col justify-between border-t-4 border-t-primary relative overflow-hidden h-full">
                    {/* Ring gauge */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="space-y-1">
                        <span className="badge bg-primary/20 text-primary uppercase text-[9px] font-bold tracking-wider">
                          Course Report
                        </span>
                        <h4 className="text-xs font-extrabold text-white leading-tight mt-1 truncate max-w-[150px]" title={course.title}>
                          {course.title}
                        </h4>
                        <p className="text-[10px] text-surface-400">By {course.instructor}</p>
                      </div>

                      {/* Circular Progress Circle */}
                      <div className="relative w-16 h-16 shrink-0">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-surface-100"
                            strokeWidth="3.5"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="text-primary"
                            strokeWidth="3.5"
                            strokeDasharray={`${card.percent}, 100`}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                          {card.percent}%
                        </div>
                      </div>
                    </div>

                    {/* Grade Visual */}
                    <div className="bg-surface/50 rounded-2xl p-4 border border-surface-100/50 mb-6 flex items-center justify-between">
                      <div>
                        <h5 className="text-[10px] text-surface-400 font-bold uppercase tracking-wider">Assigned Grade</h5>
                        <p className="text-sm font-extrabold text-white mt-0.5">Letter Grade</p>
                      </div>
                      <span className={`text-2xl font-black px-4 py-1.5 rounded-xl ${
                        card.grade.startsWith('A') 
                          ? 'bg-success/20 text-success' 
                          : card.grade.startsWith('B') 
                          ? 'bg-warning/20 text-warning' 
                          : 'bg-danger/20 text-danger'
                      }`}>
                        {card.grade}
                      </span>
                    </div>

                    {/* Teacher Remarks */}
                    <div className="space-y-1.5 flex-1">
                      <h5 className="text-[10px] text-surface-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <span>💬</span> Instructor Feedback
                      </h5>
                      <p className="text-xs text-surface-300 italic leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
                        "{card.remarks}"
                      </p>
                    </div>

                    {/* Certificate Badge */}
                    {card.percent === 100 && (
                      <div className="mt-6 pt-4 border-t border-surface-100 flex items-center justify-between">
                        <span className="text-[10px] text-success font-bold flex items-center gap-1">
                          <span>🏆</span> Certified Graduate
                        </span>
                        <button 
                          onClick={() => {
                            if (logActivity) logActivity('CLICK', `Student downloaded certificate for: "${course.title}"`);
                            alert(`Certificate downloaded successfully for "${course.title}"!`);
                          }}
                          className="bg-success text-surface font-extrabold text-[10px] px-3 py-1.5 rounded-lg hover:shadow-lg transition-shadow"
                        >
                          Get Credentials 🎖️
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 4: TIMETABLE & LESSONS */}
        {activeTab === 'timetable' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
                <span>📅</span> Live Lecture Timetable
              </h1>
              <p className="text-surface-300 text-sm mt-1">Review lesson timings, lecture topics, and connect to video meet channels.</p>
            </div>

            <div className="glass-card overflow-hidden border border-surface-100/50">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface border-b border-surface-100 text-[10px] font-bold uppercase tracking-wider text-surface-300">
                    <tr>
                      <th className="p-4">Course Detail</th>
                      <th className="p-4">Topic / Lecture Title</th>
                      <th className="p-4">Date & Time Slot</th>
                      <th className="p-4">Faculty Member</th>
                      <th className="p-4 text-center">Video link</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-100/50 text-xs">
                    {timetable.map(slot => (
                      <tr key={slot.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-bold text-white">
                          {slot.courseTitle}
                        </td>
                        <td className="p-4 text-surface-300">
                          {slot.topic}
                        </td>
                        <td className="p-4 space-y-1">
                          <div className="font-bold text-white flex items-center gap-1">
                            <span>📅</span> {slot.date}
                          </div>
                          <div className="text-[10px] text-surface-400 flex items-center gap-1">
                            <span>🕒</span> {slot.time}
                          </div>
                        </td>
                        <td className="p-4 text-surface-300">
                          {slot.instructor}
                        </td>
                        <td className="p-4 text-center">
                          <a
                            href={slot.link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block bg-primary/20 hover:bg-primary hover:text-white border border-primary/40 text-primary font-bold px-3 py-1.5 rounded-xl transition-all"
                          >
                            Join Session 🔗
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: PROFILE & CREDENTIALS */}
        {activeTab === 'profile' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
                <span>🔑</span> Profile & Credentials Manager
              </h1>
              <p className="text-surface-300 text-sm mt-1">Review student registry info, active login details, and reset passwords.</p>
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
                      <p className="text-xs text-primary-200 capitalize mt-1 font-semibold">{currentUser.role} Portal Access</p>
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
                                ? 'bg-primary border-primary text-white scale-110 shadow-glow'
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

                    <button type="submit" className="w-full btn-primary !py-2.5 !text-xs font-bold">
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

              {/* Password update & Certs */}
              <div className="lg:col-span-2 space-y-8">
                {/* Reset password form */}
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
                        className="input-field" 
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
                        className="input-field" 
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
                        className="input-field" 
                      />
                    </div>
                    <div className="sm:col-span-2 pt-2">
                      <button type="submit" className="btn-primary !py-2.5 !text-xs !w-full sm:!w-auto">
                        Update Password Credentials
                      </button>
                    </div>
                  </form>
                </div>

                {/* Earned Credentials summary */}
                <div className="glass-card p-6 space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>🎖️</span> Verified Graduation Certificates
                  </h3>
                  <div className="space-y-3">
                    {enrolledCourses.filter(c => (progressData[c.id]?.percent || 0) === 100).length > 0 ? (
                      enrolledCourses.filter(c => (progressData[c.id]?.percent || 0) === 100).map(course => (
                        <div key={course.id} className="flex items-center justify-between p-3.5 bg-success/5 border border-success/20 rounded-xl">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">📜</span>
                            <div>
                              <h4 className="text-xs font-bold text-white">{course.title}</h4>
                              <p className="text-[10px] text-success font-semibold">Certified Graduate • {progressData[course.id]?.grade} Final Grade</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => {
                              if (logActivity) logActivity('CLICK', `Student shared certificate for: "${course.title}"`);
                              alert("Certificate PDF generated! Ready for LinkedIn share.");
                            }}
                            className="bg-success text-surface text-[10px] font-black py-1.5 px-3 rounded-lg hover:shadow-glow"
                          >
                            Share Certificate
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 border border-surface-100/50 rounded-2xl text-center text-xs text-surface-300">
                        No certificates earned yet. Achieve 100% completion in any course to unlock verification.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default StudentPortal;
