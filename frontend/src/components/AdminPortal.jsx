import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';

const AdminPortal = () => {
  const { 
    currentUser, 
    setPortal, 
    courses, 
    deleteCourse,
    blogs, 
    deleteBlogPost,
    timetable,
    fetchWithAuth,
    logActivity,
    logout
  } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState('overview');
  
  // Admin stats
  const [stats, setStats] = useState({
    users: { students: 0, teachers: 0, admins: 0, total: 0 },
    courses: 0,
    blogs: 0,
    enrollments: 0
  });

  // User lists
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Create User Form State
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('student');
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showNewUserPassword, setShowNewUserPassword] = useState(false);

  // Fetch admin dashboard details
  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const [statsData, usersData] = await Promise.all([
        fetchWithAuth('/api/admin/stats'),
        fetchWithAuth('/api/admin/users')
      ]);
      setStats(statsData);
      setUsersList(usersData);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to fetch admin dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser && currentUser.role === 'admin') {
      fetchAdminData();
    }
  }, [currentUser]);

  const [activityLogs, setActivityLogs] = useState([]);

  const fetchLogs = async () => {
    try {
      setErrorMsg('');
      const logsData = await fetchWithAuth('/api/admin/logs');
      setActivityLogs(logsData);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to fetch activity logs.');
    }
  };

  useEffect(() => {
    if (activeTab === 'logs') {
      fetchLogs();
    }
  }, [activeTab]);

  // Log active tab switching
  useEffect(() => {
    if (logActivity) {
      logActivity('PORTAL_NAVIGATION', `Admin switched dashboard tab to: "${activeTab}"`);
    }
  }, [activeTab]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail || !newUserPassword || !newUserRole) {
      setErrorMsg('All fields are required.');
      return;
    }

    setIsProvisioning(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const result = await fetchWithAuth('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify({
          name: newUserName,
          email: newUserEmail,
          password: newUserPassword,
          role: newUserRole
        })
      });

      setSuccessMsg(result.message || 'User provisioned successfully.');
      if (logActivity) {
        logActivity('ADMIN_ACTION', `Provisioned new user account: "${newUserName}" (${newUserEmail}) with role "${newUserRole}"`);
      }

      // Clear form
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserRole('student');
      setIsFormOpen(false);

      // Refresh stats and user list
      fetchAdminData();

      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to provision user.');
    } finally {
      setIsProvisioning(false);
    }
  };

  // Handle Role Update
  const handleUpdateRole = async (userId, newRole) => {
    try {
      setErrorMsg('');
      setSuccessMsg('');
      const targetUser = usersList.find(u => u.id === userId);
      await fetchWithAuth(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole })
      });
      if (logActivity) {
        logActivity('ADMIN_ACTION', `Updated user "${targetUser?.name || userId}" role to: "${newRole}"`);
      }
      setSuccessMsg('User role updated successfully.');
      fetchAdminData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update user role.');
    }
  };

  // Handle User Deletion
  const handleDeleteUser = async (userId) => {
    if (userId === currentUser.id) {
      alert('You cannot delete your own admin account!');
      return;
    }
    if (!window.confirm('Are you sure you want to permanently delete this user account? This will delete all their progress and logs.')) {
      return;
    }

    try {
      setErrorMsg('');
      setSuccessMsg('');
      const targetUser = usersList.find(u => u.id === userId);
      await fetchWithAuth(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      });
      if (logActivity) {
        logActivity('ADMIN_ACTION', `Permanently deleted user account: "${targetUser?.name || userId}" (${targetUser?.email || 'Unknown Email'})`);
      }
      setSuccessMsg('User account deleted successfully.');
      fetchAdminData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to delete user.');
    }
  };

  // Moderation: Delete Course
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course? This will remove all modules and student enrollment cards.')) {
      return;
    }
    try {
      await deleteCourse(courseId);
      setSuccessMsg('Course deleted successfully.');
      fetchAdminData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg('Failed to delete course.');
    }
  };

  // Moderation: Delete Blog
  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) {
      return;
    }
    try {
      await deleteBlogPost(blogId);
      setSuccessMsg('Blog post deleted successfully.');
      fetchAdminData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg('Failed to delete blog post.');
    }
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-surface text-white flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md p-6">
          <span className="text-5xl">🚫</span>
          <h1 className="text-xl font-bold text-danger">Access Denied</h1>
          <p className="text-xs text-surface-300">You must be logged in as an administrator to view this control panel.</p>
          <button onClick={() => setPortal('landing')} className="btn-primary !py-2 !px-4 text-xs">Go to Home Page</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface text-white flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-surface-50 border-r border-surface-100/50 flex flex-col p-6 space-y-8 z-10 shrink-0">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-warning to-yellow-600 flex items-center justify-center text-white font-bold text-base shadow-glow shadow-warning/20">
            👑
          </div>
          <span className="text-lg font-bold gradient-text">DigiBookAdmin</span>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface border border-surface-100/40">
          <div className="w-10 h-10 rounded-xl bg-warning/20 text-warning flex items-center justify-center text-xl font-bold shadow-md">
            👑
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-bold truncate leading-snug">{currentUser.name}</h4>
            <p className="text-[10px] text-warning font-semibold leading-none mt-0.5 uppercase tracking-wide">Administrator</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col space-y-2">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: '📊' },
            { id: 'users', label: 'Users Registry & Roles', icon: '👥' },
            { id: 'courses', label: 'Moderate Courses', icon: '📚' },
            { id: 'blogs', label: 'Moderate Blogs', icon: '✍️' },
            { id: 'logs', label: 'System Activity Logs', icon: '📜' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-300 ${
                activeTab === item.id 
                  ? 'bg-warning text-surface font-extrabold shadow-lg shadow-warning/10' 
                  : 'text-surface-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="pt-6 border-t border-surface-100/40 space-y-2">
          <p className="text-[10px] text-surface-400 font-bold uppercase tracking-wider px-2">Access Dashboards</p>
          <button
            onClick={() => setPortal('student')}
            className="w-full py-2 rounded-xl border border-surface-100/50 hover:bg-white/5 text-[11px] font-semibold transition-colors flex items-center gap-2 px-3"
          >
            🎓 Student Dashboard
          </button>
          <button
            onClick={() => setPortal('teacher')}
            className="w-full py-2 rounded-xl border border-surface-100/50 hover:bg-white/5 text-[11px] font-semibold transition-colors flex items-center gap-2 px-3"
          >
            👨‍🏫 Teacher Dashboard
          </button>
          <button
            onClick={() => setPortal('marketing')}
            className="w-full py-2 rounded-xl border border-surface-100/50 hover:bg-white/5 text-[11px] font-semibold transition-colors flex items-center gap-2 px-3"
          >
            📢 Marketing Portal
          </button>
          <div className="pt-2 border-t border-surface-100/20 space-y-2">
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
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        
        {/* Error/Success banners */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-danger/10 border border-danger/20 text-danger text-xs rounded-2xl font-semibold animate-pulse-slow">
            ⚠️ {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-6 p-4 bg-success/10 border border-success/20 text-success text-xs rounded-2xl font-semibold">
            ✓ {successMsg}
          </div>
        )}

        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-2">
              <span className="text-3xl block animate-spin">⏳</span>
              <p className="text-xs text-surface-300">Synchronizing database tables...</p>
            </div>
          </div>
        ) : (
          <>
            {/* VIEW 1: OVERVIEW DASHBOARD */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-fade-in">
                {/* Header */}
                <div className="bg-gradient-to-r from-warning/10 via-yellow-600/5 to-transparent border border-surface-100/40 p-6 rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-warning/5 rounded-full blur-3xl pointer-events-none" />
                  <h1 className="text-2xl md:text-3xl font-extrabold text-white">Platform Control Dashboard 👑</h1>
                  <p className="text-surface-300 text-sm mt-1">Review live server counts, manage registered students/instructors, and moderate posted content.</p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="glass-card p-6 flex items-center justify-between border-t-2 border-t-warning">
                    <div>
                      <p className="text-surface-300 text-xs font-semibold uppercase tracking-wider">Total Registrations</p>
                      <h3 className="text-2xl font-bold mt-1 text-white">{stats.users.total} Users</h3>
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-warning/10 text-warning flex items-center justify-center text-lg">👥</div>
                  </div>

                  <div className="glass-card p-6 flex items-center justify-between border-t-2 border-t-primary">
                    <div>
                      <p className="text-surface-300 text-xs font-semibold uppercase tracking-wider">Active Students</p>
                      <h3 className="text-2xl font-bold mt-1 text-white">{stats.users.students} Students</h3>
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg">🎓</div>
                  </div>

                  <div className="glass-card p-6 flex items-center justify-between border-t-2 border-t-accent">
                    <div>
                      <p className="text-surface-300 text-xs font-semibold uppercase tracking-wider">Active Teachers</p>
                      <h3 className="text-2xl font-bold mt-1 text-white">{stats.users.teachers} Faculty</h3>
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-accent/10 text-accent flex items-center justify-center text-lg">👨‍🏫</div>
                  </div>

                  <div className="glass-card p-6 flex items-center justify-between border-t-2 border-t-success">
                    <div>
                      <p className="text-surface-300 text-xs font-semibold uppercase tracking-wider">Total Enrollments</p>
                      <h3 className="text-2xl font-bold mt-1 text-white">{stats.enrollments} Cards</h3>
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-success/10 text-success flex items-center justify-center text-lg">📈</div>
                  </div>
                </div>

                {/* Submetrics / Summaries */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="glass-card p-6 space-y-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>📚</span> Course Moderation Overview
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs pb-3 border-b border-surface-100">
                        <span className="text-surface-300">Catalog Courses:</span>
                        <span className="font-bold text-white">{stats.courses} Listings</span>
                      </div>
                      <div className="flex justify-between items-center text-xs pb-3 border-b border-surface-100">
                        <span className="text-surface-300">Average Students per Course:</span>
                        <span className="font-bold text-white">
                          {stats.courses > 0 ? Math.round(stats.enrollments / stats.courses) : 0} enrolled
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card p-6 space-y-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>✍️</span> Knowledgebase Overview
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs pb-3 border-b border-surface-100">
                        <span className="text-surface-300">Academic Blogs & News:</span>
                        <span className="font-bold text-white">{stats.blogs} Publications</span>
                      </div>
                      <div className="flex justify-between items-center text-xs pb-3 border-b border-surface-100">
                        <span className="text-surface-300">Live Lectures Scheduled:</span>
                        <span className="font-bold text-white">{timetable.length} Slots</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2: USERS REGISTRY & ROLES */}
            {activeTab === 'users' && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
                      <span>👥</span> User Accounts Registry
                    </h1>
                    <p className="text-surface-300 text-sm mt-1">Modify registered account credentials, toggle user access roles, or delete records.</p>
                  </div>
                  <button
                    onClick={() => setIsFormOpen(!isFormOpen)}
                    className="py-2.5 px-5 text-xs font-bold flex items-center gap-2 bg-gradient-to-r from-warning to-yellow-600 text-surface rounded-xl shadow-md hover:shadow-warning/10 transition-all border border-warning/10"
                  >
                    <span>{isFormOpen ? '✕ Cancel' : '➕ Provision User'}</span>
                  </button>
                </div>

                {isFormOpen && (
                  <form onSubmit={handleCreateUser} className="glass-card p-6 border border-warning/20 relative animate-scale-up space-y-4">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-warning/5 rounded-full blur-2xl pointer-events-none" />
                    
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                      <span>🔑</span> Provision New Account (Programmatic Clerk & DB Creation)
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-surface-300 uppercase tracking-wider mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={newUserName}
                          onChange={(e) => setNewUserName(e.target.value)}
                          placeholder="e.g. John Doe"
                          className="input-field text-xs bg-surface/50 border-surface-100/50"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-surface-300 uppercase tracking-wider mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={newUserEmail}
                          onChange={(e) => setNewUserEmail(e.target.value)}
                          placeholder="e.g. johndoe@gmail.com"
                          className="input-field text-xs bg-surface/50 border-surface-100/50"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-surface-300 uppercase tracking-wider mb-2">
                          Account Password
                        </label>
                        <div className="relative">
                          <input
                            type={showNewUserPassword ? "text" : "password"}
                            required
                            value={newUserPassword}
                            onChange={(e) => setNewUserPassword(e.target.value)}
                            placeholder="Secure password"
                            className="input-field text-xs bg-surface/50 border-surface-100/50 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewUserPassword(!showNewUserPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-300 hover:text-white text-xs select-none"
                          >
                            {showNewUserPassword ? '👁️' : '🙈'}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-surface-300 uppercase tracking-wider mb-2">
                          Access Role
                        </label>
                        <select
                          value={newUserRole}
                          onChange={(e) => setNewUserRole(e.target.value)}
                          className="input-field text-xs bg-surface/50 border-surface-100/50 text-white font-bold"
                        >
                          <option value="student">🎓 Student Role</option>
                          <option value="teacher">👨‍🏫 Teacher / Faculty Role</option>
                          <option value="marketing">📢 Marketing Role</option>
                          <option value="admin">👑 Admin Role</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsFormOpen(false)}
                        className="btn-secondary !py-2 !px-4 !text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isProvisioning}
                        className="btn-primary !py-2 !px-6 !text-xs bg-warning hover:bg-warning-600 text-surface font-extrabold flex items-center gap-1.5"
                      >
                        {isProvisioning ? (
                          <>
                            <span className="animate-spin">⏳</span> Provisioning...
                          </>
                        ) : (
                          '✓ Create Account'
                        )}
                      </button>
                    </div>
                  </form>
                )}

                <div className="glass-card overflow-hidden border border-surface-100/50">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-surface border-b border-surface-100 text-[10px] font-bold uppercase tracking-wider text-surface-300">
                        <tr>
                          <th className="p-4">User Details</th>
                          <th className="p-4">Registered Email</th>
                          <th className="p-4">Current Role</th>
                          <th className="p-4 text-center">Modify Role</th>
                          <th className="p-4 text-center">Delete Account</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-100/50 text-xs">
                        {usersList.map(user => (
                          <tr key={user.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 flex items-center gap-3">
                              <span className="text-xl">{user.avatar || '🎓'}</span>
                              <div>
                                <h4 className="font-bold text-white">{user.name}</h4>
                                <p className="text-[10px] text-surface-400">UID: {user.id}</p>
                              </div>
                            </td>
                            <td className="p-4 text-surface-300 font-mono">
                              {user.email}
                            </td>
                            <td className="p-4">
                              <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase ${
                                user.role === 'admin' 
                                  ? 'bg-warning/20 text-warning' 
                                  : user.role === 'teacher' 
                                  ? 'bg-accent/20 text-accent' 
                                  : 'bg-primary/20 text-primary'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <select
                                value={user.role}
                                disabled={user.id === currentUser.id}
                                onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                                className="bg-surface border border-surface-100 text-white rounded-lg text-[10px] font-bold py-1 px-2 focus:outline-none focus:border-warning"
                              >
                                <option value="student">Student</option>
                                <option value="teacher">Teacher</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>
                            <td className="p-4 text-center">
                              <button
                                disabled={user.id === currentUser.id}
                                onClick={() => handleDeleteUser(user.id)}
                                className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${
                                  user.id === currentUser.id
                                    ? 'border-surface-100 text-surface-300 cursor-not-allowed opacity-50'
                                    : 'border-danger/20 bg-danger/5 hover:bg-danger/20 text-danger'
                                }`}
                              >
                                Delete User
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 3: MODERATE COURSES */}
            {activeTab === 'courses' && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
                    <span>📚</span> Course Catalog Moderation
                  </h1>
                  <p className="text-surface-300 text-sm mt-1">Review active courses, monitor instructor listings, and remove courses from catalog.</p>
                </div>

                <div className="glass-card overflow-hidden border border-surface-100/50">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-surface border-b border-surface-100 text-[10px] font-bold uppercase tracking-wider text-surface-300">
                        <tr>
                          <th className="p-4">Course Info</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Instructor</th>
                          <th className="p-4">Rating / Students</th>
                          <th className="p-4 text-center">Catalog Moderation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-100/50 text-xs">
                        {courses.map(course => (
                          <tr key={course.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 flex items-center gap-3">
                              <img src={course.image} alt={course.title} className="w-10 h-10 rounded-lg object-cover" />
                              <h4 className="font-bold text-white max-w-sm">{course.title}</h4>
                            </td>
                            <td className="p-4 text-surface-300 font-semibold">
                              {course.category}
                            </td>
                            <td className="p-4 text-surface-300 font-medium">
                              {course.instructor}
                            </td>
                            <td className="p-4 space-y-0.5">
                              <p className="text-white font-bold">⭐ {course.rating.toFixed(1)}</p>
                              <p className="text-[10px] text-surface-400">{course.students.toLocaleString()} students</p>
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => handleDeleteCourse(course.id)}
                                className="px-3 py-1.5 rounded-lg border border-danger/20 bg-danger/5 hover:bg-danger/20 text-danger text-[10px] font-bold transition-all"
                              >
                                Delete Course
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 4: MODERATE BLOGS */}
            {activeTab === 'blogs' && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
                    <span>✍️</span> Knowledgebase Moderation
                  </h1>
                  <p className="text-surface-300 text-sm mt-1">Review academic newsletters, edit tutorials, or delete published blog posts.</p>
                </div>

                <div className="glass-card overflow-hidden border border-surface-100/50">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-surface border-b border-surface-100 text-[10px] font-bold uppercase tracking-wider text-surface-300">
                        <tr>
                          <th className="p-4">Article Title</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Author Details</th>
                          <th className="p-4">Publish Date</th>
                          <th className="p-4 text-center">Content Moderation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-100/50 text-xs">
                        {blogs.map(blog => (
                          <tr key={blog.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 flex items-center gap-3">
                              {blog.image && <img src={blog.image} alt={blog.title} className="w-10. h-10 rounded-lg object-cover shrink-0 w-10 h-10" />}
                              <h4 className="font-bold text-white truncate max-w-xs" title={blog.title}>{blog.title}</h4>
                            </td>
                            <td className="p-4 text-surface-300 font-semibold">
                              {blog.category}
                            </td>
                            <td className="p-4 text-surface-300 font-medium">
                              {blog.author}
                            </td>
                            <td className="p-4 text-surface-400">
                              {blog.date}
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => handleDeleteBlog(blog.id)}
                                className="px-3 py-1.5 rounded-lg border border-danger/20 bg-danger/5 hover:bg-danger/20 text-danger text-[10px] font-bold transition-all"
                              >
                                Delete Post
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 5: ACTIVITY LOGS */}
            {activeTab === 'logs' && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
                      <span>📜</span> System Activity Logs
                    </h1>
                    <p className="text-surface-300 text-sm mt-1">Real-time log of user sign-ins, page navigation, clicks, and system events.</p>
                  </div>
                  <button
                    onClick={fetchLogs}
                    className="btn-primary !py-2 !px-4 !text-xs flex items-center gap-1.5"
                  >
                    <span>🔄</span> Refresh Logs
                  </button>
                </div>

                <div className="glass-card p-6 border border-surface-100/50">
                  <div className="bg-black/40 rounded-2xl p-4 font-mono text-xs overflow-y-auto max-h-[500px] border border-surface-100/30 space-y-2 select-text scrollbar-thin">
                    {activityLogs.length > 0 ? (
                      activityLogs.map((log, index) => {
                        let colorClass = 'text-surface-300';
                        if (log.includes('[AUTH_SUCCESS]')) colorClass = 'text-success font-bold';
                        else if (log.includes('[AUTH_FAILURE]')) colorClass = 'text-danger font-bold';
                        else if (log.includes('[ROUTE]')) colorClass = 'text-primary';
                        else if (log.includes('[PROGRESS_COMPLETE]') || log.includes('[PROGRESS_UPDATE]')) colorClass = 'text-accent';
                        else if (log.includes('[ADMIN_ACTION]')) colorClass = 'text-warning font-bold';
                        else if (log.includes('[CLICK]')) colorClass = 'text-purple-300';
                        
                        return (
                          <div key={index} className={`whitespace-pre-wrap border-b border-white/5 pb-1.5 last:border-0 last:pb-0 ${colorClass}`}>
                            {log}
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-surface-400 italic text-center py-8">No activity logs recorded yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminPortal;
