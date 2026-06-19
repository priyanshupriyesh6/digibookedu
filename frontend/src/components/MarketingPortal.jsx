import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';

const PRESETS = [
  { name: 'Cyber Security Shield', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80' },
  { name: 'Full-Stack Workstation', url: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=600&q=80' },
  { name: 'Network Servers Glow', url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80' },
  { name: 'Abstract Cyber Matrix', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80' }
];

const MarketingPortal = () => {
  const { 
    currentUser, 
    blogs, 
    addBlogPost, 
    deleteBlogPost, 
    setPortal, 
    logout, 
    updateProfile, 
    updatePassword, 
    logActivity 
  } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState('dashboard');

  // New Blog form state
  const [blogForm, setBlogForm] = useState({
    title: '',
    category: 'Cybersecurity',
    summary: '',
    content: '',
    image: PRESETS[0].url
  });
  const [blogSuccess, setBlogSuccess] = useState('');

  // Profile management state
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editAvatar, setEditAvatar] = useState(currentUser?.avatar || '📢');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [passwordForm, setPasswordForm] = useState({ old: '', new: '', confirm: '' });
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Blog filter/search state
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (logActivity) {
      logActivity('PORTAL_NAVIGATION', `Marketing team switched dashboard tab to: "${activeTab}"`);
    }
  }, [activeTab]);

  if (!currentUser || (currentUser.role !== 'marketing' && currentUser.role !== 'admin')) {
    return (
      <div className="min-h-screen bg-surface text-white flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md p-6">
          <span className="text-5xl">🚫</span>
          <h1 className="text-xl font-bold text-danger">Access Denied</h1>
          <p className="text-xs text-surface-300">This area is reserved for the Digital Marketing team or administrators.</p>
          <button onClick={() => setPortal('landing')} className="btn-primary !py-2 !px-4 text-xs">Return to Home Page</button>
        </div>
      </div>
    );
  }

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!blogForm.title || !blogForm.summary || !blogForm.content) {
      alert('Please fill out all required blog post fields.');
      return;
    }
    await addBlogPost(blogForm);
    setBlogSuccess('Blog post published live to the platform!');
    setBlogForm({
      title: '',
      category: 'Cybersecurity',
      summary: '',
      content: '',
      image: PRESETS[0].url
    });
    setTimeout(() => setBlogSuccess(''), 4000);
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      await deleteBlogPost(id);
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

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      alert("New passwords do not match!");
      return;
    }
    const res = await updatePassword(passwordForm.old, passwordForm.new);
    if (res.success) {
      setPasswordSuccess("Password updated successfully!");
      setPasswordForm({ old: '', new: '', confirm: '' });
      setTimeout(() => setPasswordSuccess(''), 4000);
    } else {
      alert(res.message || "Failed to update password.");
    }
  };

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-surface text-white flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-surface-50 border-r border-surface-100/50 flex flex-col p-6 space-y-8 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-base">
            📢
          </div>
          <span className="text-lg font-bold gradient-text">DigiMarketing</span>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface border border-surface-100/40">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent text-sm font-bold">
            {currentUser.avatar || '📢'}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-bold truncate leading-snug">{currentUser.name}</h4>
            <p className="text-[10px] text-accent font-semibold leading-none mt-0.5 uppercase tracking-wider">Marketing Hub</p>
          </div>
        </div>

        <nav className="flex-1 flex flex-col space-y-2">
          {[
            { id: 'dashboard', label: 'Marketing Dashboard', icon: '📊' },
            { id: 'publish', label: 'Write & Publish Post', icon: '✍️' },
            { id: 'manage', label: 'Manage Publications', icon: '📋' },
            { id: 'profile', label: 'Security & Profile', icon: '🔑' }
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
            onClick={() => setPortal('blogs')}
            className="w-full py-2.5 rounded-xl border border-surface-100 hover:bg-white/5 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
          >
            📰 View Live Blogs
          </button>
          <button
            onClick={() => setPortal('landing')}
            className="w-full py-2.5 rounded-xl border border-surface-100 hover:bg-white/5 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
          >
            🌐 Back to main site
          </button>
          <button
            onClick={() => {
              logout();
              setPortal('landing');
            }}
            className="w-full py-2.5 rounded-xl bg-danger/10 hover:bg-danger/20 border border-danger/20 text-danger text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* Main Panel Workspace */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        
        {/* VIEW 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-accent/15 via-primary/5 to-transparent border border-accent/20 p-6 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white">Campaign & Blog Control Center 📢</h1>
                <p className="text-surface-300 text-sm mt-1">Publish fresh academic articles, share program highlights, and manage student blog feeds.</p>
              </div>
              <div className="bg-accent/10 border border-accent/20 px-4 py-2 rounded-2xl flex items-center gap-3 shrink-0">
                <span className="text-xl">📊</span>
                <div>
                  <h4 className="text-xs font-bold leading-none text-white">Active Portal</h4>
                  <p className="text-[10px] text-accent mt-1 font-semibold">Digital Marketing</p>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-6 flex items-center justify-between">
                <div>
                  <p className="text-surface-300 text-xs font-semibold uppercase tracking-wider">Total Articles</p>
                  <h3 className="text-3xl font-black mt-1 text-white">{blogs.length} Posts</h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center text-accent text-xl">📝</div>
              </div>
              
              <div className="glass-card p-6 flex items-center justify-between">
                <div>
                  <p className="text-surface-300 text-xs font-semibold uppercase tracking-wider">Latest Category</p>
                  <h3 className="text-xl font-bold mt-2 text-white">{blogs[0]?.category || 'None'}</h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary text-xl">🏷️</div>
              </div>

              <div className="glass-card p-6 flex items-center justify-between">
                <div>
                  <p className="text-surface-300 text-xs font-semibold uppercase tracking-wider">Admin Status</p>
                  <h3 className="text-sm font-bold mt-2 text-success flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" /> Verified Live Access
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center text-success text-xl">🛡️</div>
              </div>
            </div>

            {/* Recent Posts Board */}
            <div className="glass-card p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>📰</span> Recently Published Posts
                </h3>
                <button onClick={() => setActiveTab('publish')} className="text-xs text-accent font-bold hover:underline">
                  Publish New Article +
                </button>
              </div>

              <div className="space-y-4">
                {blogs.slice(0, 3).map(post => (
                  <div key={post.id} className="p-4 rounded-xl bg-surface border border-surface-100/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {post.image && (
                        <img src={post.image} alt={post.title} className="w-12 h-12 rounded-lg object-cover" />
                      )}
                      <div>
                        <span className="text-[10px] font-bold text-accent uppercase">{post.category}</span>
                        <h4 className="text-xs font-bold text-white leading-tight mt-0.5">{post.title}</h4>
                        <p className="text-[10px] text-surface-400 mt-0.5">By {post.author} • {post.date} • {post.readTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <button 
                        onClick={() => handleDelete(post.id, post.title)}
                        className="text-xs text-danger font-bold bg-danger/10 hover:bg-danger/20 px-3 py-1.5 rounded-lg border border-danger/25 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {blogs.length === 0 && (
                  <p className="text-xs text-surface-400 text-center py-6">No articles published yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: WRITE & PUBLISH POST */}
        {activeTab === 'publish' && (
          <div className="space-y-8 animate-fade-in max-w-4xl">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
                <span>✍️</span> Compose New Publication
              </h1>
              <p className="text-surface-300 text-sm mt-1">Submit high-value articles. The post is pushed immediately onto the public academic blog catalog.</p>
            </div>

            {blogSuccess && (
              <div className="p-4 bg-success/20 border border-success/30 text-success rounded-xl text-xs font-bold animate-pulse">
                ✓ {blogSuccess}
              </div>
            )}

            <form onSubmit={handlePublish} className="glass-card p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs text-surface-300 font-semibold uppercase tracking-wider">Article Title</label>
                  <input
                    type="text"
                    required
                    value={blogForm.title}
                    onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                    placeholder="e.g. Cybersecurity career path in 2026..."
                    className="input-field"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-surface-300 font-semibold uppercase tracking-wider">Category</label>
                  <select
                    value={blogForm.category}
                    onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                    className="input-field appearance-none"
                  >
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Programming">Programming</option>
                    <option value="General EdTech">General EdTech</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-surface-300 font-semibold uppercase tracking-wider">Summary / TL;DR</label>
                <input
                  type="text"
                  required
                  value={blogForm.summary}
                  onChange={(e) => setBlogForm({ ...blogForm, summary: e.target.value })}
                  placeholder="Provide a compelling 1-2 sentence overview for the cards list..."
                  className="input-field"
                />
              </div>

              {/* Cover Image Selector */}
              <div className="space-y-3">
                <label className="text-xs text-surface-300 font-semibold uppercase tracking-wider">Article Cover Image URL</label>
                <input
                  type="url"
                  required
                  value={blogForm.image}
                  onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
                  placeholder="Cover image url..."
                  className="input-field"
                />
                
                {/* Presets Grid */}
                <div className="space-y-1.5">
                  <p className="text-[10px] text-surface-400 font-bold uppercase tracking-wider">Or Select Preset Cover Artwork:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {PRESETS.map(preset => (
                      <button
                        type="button"
                        key={preset.name}
                        onClick={() => setBlogForm({ ...blogForm, image: preset.url })}
                        className={`p-2 rounded-xl border text-[10px] text-left transition-all duration-300 flex flex-col gap-1.5 ${
                          blogForm.image === preset.url 
                            ? 'border-accent bg-accent/10 shadow-glow' 
                            : 'border-surface-100 hover:bg-white/5 bg-surface-50/50'
                        }`}
                      >
                        <img src={preset.url} alt={preset.name} className="h-14 w-full rounded-lg object-cover" />
                        <span className="truncate font-bold text-white leading-tight w-full">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-surface-300 font-semibold uppercase tracking-wider">Article Body Content</label>
                <textarea
                  required
                  rows="10"
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  placeholder="Draft your academic blog article here..."
                  className="input-field font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-accent text-surface font-black text-sm hover:shadow-glow transition-all duration-300 hover:scale-[1.01]"
              >
                Publish Blog Post Live 🚀
              </button>
            </form>
          </div>
        )}

        {/* VIEW 3: MANAGE PUBLICATIONS */}
        {activeTab === 'manage' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
                  <span>📋</span> Manage Published Blogs
                </h1>
                <p className="text-surface-300 text-sm mt-1">Audit, search, and delete live content records directly through the portal database.</p>
              </div>
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface-50 border border-surface-100 text-xs text-white placeholder:text-surface-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-surface-300">🔍</span>
              </div>
            </div>

            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-50 text-surface-400 font-bold uppercase border-b border-surface-100/50">
                    <tr>
                      <th className="p-4">Post Info</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Published On</th>
                      <th className="p-4">Est. Read Time</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-100/50 font-medium">
                    {filteredBlogs.map(post => (
                      <tr key={post.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          {post.image && (
                            <img src={post.image} alt={post.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                          )}
                          <div className="max-w-xs sm:max-w-md">
                            <h4 className="font-extrabold text-white leading-tight truncate">{post.title}</h4>
                            <p className="text-[10px] text-surface-400 truncate mt-0.5">Author: {post.author}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="badge bg-primary/20 text-primary uppercase text-[9px] font-bold">
                            {post.category}
                          </span>
                        </td>
                        <td className="p-4 text-surface-300">{post.date}</td>
                        <td className="p-4 text-surface-300">{post.readTime}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDelete(post.id, post.title)}
                            className="text-[11px] text-danger font-bold hover:bg-danger/10 px-2.5 py-1.5 rounded-lg border border-danger/20 transition-all"
                          >
                            Delete Post
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredBlogs.length === 0 && (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-surface-400">No blog publications found matching the query.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: SECURITY & PROFILE */}
        {activeTab === 'profile' && (
          <div className="space-y-8 animate-fade-in max-w-4xl">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
                <span>🔑</span> Security Credentials & Profile Settings
              </h1>
              <p className="text-surface-300 text-sm mt-1">Review active tokens, update workspace display names, or reset secure account passwords.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Profile details */}
              <div className="space-y-6">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>👤</span> Edit Team Information
                </h3>
                
                {profileSuccess && (
                  <div className="p-3.5 bg-success/20 border border-success/30 text-success rounded-xl text-xs font-bold animate-pulse">
                    ✓ {profileSuccess}
                  </div>
                )}

                <form onSubmit={handleProfileUpdate} className="glass-card p-6 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-surface-300 font-semibold uppercase">Workspace Display Name</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-surface-300 font-semibold uppercase">Marketing Avatar Emoji</label>
                    <select
                      value={editAvatar}
                      onChange={(e) => setEditAvatar(e.target.value)}
                      className="input-field appearance-none"
                    >
                      <option value="📢">📢 Broadcast Megaphone</option>
                      <option value="💡">💡 Idea Lightbulb</option>
                      <option value="✨">✨ Magic Sparkles</option>
                      <option value="📊">📊 Data Chart</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-primary !py-2.5 text-xs font-bold"
                  >
                    Save Profile Changes
                  </button>
                </form>
              </div>

              {/* Password update */}
              <div className="space-y-6">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>🔒</span> Change Security Password
                </h3>

                {passwordSuccess && (
                  <div className="p-3.5 bg-success/20 border border-success/30 text-success rounded-xl text-xs font-bold animate-pulse">
                    ✓ {passwordSuccess}
                  </div>
                )}

                <form onSubmit={handlePasswordReset} className="glass-card p-6 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-surface-300 font-semibold uppercase">Current Account Password</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.old}
                      onChange={(e) => setPasswordForm({ ...passwordForm, old: e.target.value })}
                      placeholder="••••••••"
                      className="input-field"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-surface-300 font-semibold uppercase">New Secure Password</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.new}
                      onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                      placeholder="••••••••"
                      className="input-field"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-surface-300 font-semibold uppercase">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.confirm}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                      placeholder="••••••••"
                      className="input-field"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-accent !py-2.5 text-xs font-black"
                  >
                    Update Account Password
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default MarketingPortal;
