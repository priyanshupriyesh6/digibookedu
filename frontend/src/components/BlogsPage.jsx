import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

const BlogsPage = () => {
  const { blogs, addBlogPost, currentUser, logActivity } = useContext(AppContext);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Selected Blog for detailed reading
  const [activeBlog, setActiveBlog] = useState(null);
  
  // Create Post Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    category: 'Cybersecurity',
    author: currentUser?.name || 'Guest Instructor',
    summary: '',
    content: '',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80'
  });
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Category list
  const categoriesList = ['All', 'Cybersecurity', 'Web Development', 'Data Science', 'AI & ML', 'Cloud Computing'];

  // Filter and Search Logic
  const filteredBlogs = blogs.filter(blog => {
    const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
    const matchesSearch = 
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      blog.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.summary || !newPost.content) {
      alert('Please fill out all fields.');
      return;
    }
    
    addBlogPost({
      title: newPost.title,
      category: newPost.category,
      author: newPost.author,
      summary: newPost.summary,
      content: newPost.content,
      image: newPost.image || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80'
    });

    setPublishSuccess(true);
    setNewPost({
      title: '',
      category: 'Cybersecurity',
      author: currentUser?.name || 'Guest Instructor',
      summary: '',
      content: '',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80'
    });

    setTimeout(() => {
      setPublishSuccess(false);
      setIsCreateOpen(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-surface text-white flex flex-col">
      {/* Blog Page Banner */}
      <header className="relative bg-gradient-to-b from-surface-50/60 via-surface/40 to-surface border-b border-surface-100/50 py-16 px-6 md:px-[10%]">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-accent/5 pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          <span className="badge bg-primary/20 text-accent uppercase tracking-wider text-[10px] px-3 py-1 font-bold">
            💡 Academic Publications & Insights
          </span>
          <h1 className="text-4xl md:text-5xl font-black leading-none gradient-text">
            DigiBookEdu Blog & Newsroom
          </h1>
          <p className="text-sm md:text-base text-surface-300 max-w-2xl mx-auto leading-relaxed">
            Read professional guides, programming tutorials, cybersecurity updates, and research papers compiled by our global expert instructors.
          </p>
        </div>
      </header>

      {/* Search, Filter & Create Bar */}
      <section className="px-6 md:px-[10%] py-8 border-b border-surface-100/30 bg-surface-50/30 sticky top-[72px] backdrop-blur-md z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Category Chips */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {categoriesList.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-glow'
                    : 'bg-surface-50 border border-surface-100/40 text-surface-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar & Write button */}
          <div className="flex gap-3 w-full md:w-auto items-center shrink-0">
            <div className="relative flex-1 md:flex-none">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search publications..."
                className="pl-10 pr-4 py-2 rounded-xl bg-surface border border-surface-100 text-xs text-white placeholder:text-surface-300 focus:outline-none focus:border-primary w-full md:w-56 transition-all duration-200"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-surface-300">🔍</span>
            </div>

            <button
              onClick={() => setIsCreateOpen(true)}
              className="btn-primary !py-2.5 !px-5 !text-xs whitespace-nowrap flex items-center gap-1.5"
            >
              <span>✍️</span> Publish Article
            </button>
          </div>
        </div>
      </section>

      {/* Blog Cards Grid */}
      <main className="flex-grow px-6 md:px-[10%] py-12 max-w-7xl mx-auto w-full">
        {filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <article 
                key={blog.id} 
                className="glass-card overflow-hidden hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 border border-surface-100 flex flex-col h-full group"
              >
                {/* Cover Image */}
                <div className="relative overflow-hidden aspect-[16/10] shrink-0">
                  <img 
                    src={blog.image} 
                    alt={blog.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103" 
                  />
                  <span className="absolute top-4 left-4 badge bg-surface/90 backdrop-blur-md text-white font-bold border border-white/10 uppercase tracking-wider text-[9px]">
                    {blog.category}
                  </span>
                </div>

                {/* Content Info */}
                <div className="p-6 flex flex-col flex-grow space-y-4">
                  <div className="flex items-center gap-3 text-[10px] text-surface-400 font-semibold">
                    <span className="flex items-center gap-1">👤 By {blog.author}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">📅 {blog.date}</span>
                  </div>

                  <h3 className="text-base font-extrabold text-white leading-tight group-hover:text-primary transition-colors flex-grow">
                    {blog.title}
                  </h3>

                  <p className="text-xs text-surface-300 line-clamp-3 leading-relaxed">
                    {blog.summary}
                  </p>

                  <div className="border-t border-surface-100/50 pt-4 mt-auto flex justify-between items-center text-xs font-bold text-accent">
                    <span className="text-[10px] text-surface-400">{blog.readTime}</span>
                    <button 
                      onClick={() => {
                        setActiveBlog(blog);
                        if (logActivity) logActivity('CLICK', `User clicked to read full article: "${blog.title}"`);
                      }}
                      className="hover:underline flex items-center gap-1"
                    >
                      Read Full Article ➔
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center max-w-xl mx-auto space-y-4">
            <span className="text-4xl block">🔍</span>
            <h3 className="text-lg font-bold text-white">No publications matched your search</h3>
            <p className="text-xs text-surface-300">Try checking your spelling, selecting another category, or writing a post to get started.</p>
          </div>
        )}
      </main>

      {/* FULL READER MODAL */}
      {activeBlog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
          <div className="bg-surface-50 border border-surface-100 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl animate-scale-up my-8 max-h-[85vh] flex flex-col">
            {/* Header info */}
            <div className="p-6 md:p-8 border-b border-surface-100/50 flex justify-between items-start shrink-0">
              <div className="space-y-2">
                <span className="badge bg-primary/20 text-accent text-[9px] uppercase tracking-wider font-bold">
                  {activeBlog.category}
                </span>
                <h2 className="text-xl md:text-2xl font-black text-white leading-tight pr-6">
                  {activeBlog.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-surface-300 font-medium">
                  <span>👤 By {activeBlog.author}</span>
                  <span>•</span>
                  <span>📅 {activeBlog.date}</span>
                  <span>•</span>
                  <span>⏱️ {activeBlog.readTime}</span>
                </div>
              </div>
              <button 
                onClick={() => setActiveBlog(null)}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center justify-center transition-colors shrink-0 text-sm"
              >
                ✕
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-grow">
              <img 
                src={activeBlog.image} 
                alt={activeBlog.title} 
                className="w-full aspect-[16/9] object-cover rounded-2xl shadow-lg border border-surface-100/30"
              />
              
              <div className="text-sm leading-relaxed text-surface-300 space-y-4 font-normal">
                {activeBlog.content.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Footer close button */}
            <div className="p-5 border-t border-surface-100/50 flex justify-end shrink-0">
              <button
                onClick={() => setActiveBlog(null)}
                className="btn-secondary !py-2 !px-5 !text-xs"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE POST MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-50 border border-surface-100 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-scale-up max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-surface-100/50 flex justify-between items-center shrink-0">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>✍️</span> Publish Academic Post
              </h2>
              <button 
                onClick={() => setIsCreateOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center justify-center transition-colors shrink-0 text-sm"
              >
                ✕
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleCreateSubmit} className="p-6 overflow-y-auto space-y-4 flex-grow text-xs">
              {publishSuccess && (
                <div className="p-3 bg-success/10 border border-success/20 text-success rounded-xl font-bold flex items-center gap-2">
                  ✓ Article published successfully! Reloading feed...
                </div>
              )}

              <div>
                <label className="block text-[9px] font-bold text-surface-300 uppercase tracking-wider mb-2">Article Title</label>
                <input 
                  type="text" 
                  required
                  value={newPost.title}
                  onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Navigating WebNN APIs in Chrome 124" 
                  className="input-field" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-surface-300 uppercase tracking-wider mb-2">Category</label>
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
                    className="input-field bg-surface-50 text-white"
                  >
                    {categoriesList.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat} className="bg-surface">{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-surface-300 uppercase tracking-wider mb-2">Author Name</label>
                  <input 
                    type="text" 
                    required
                    value={newPost.author}
                    onChange={(e) => setNewPost(prev => ({ ...prev, author: e.target.value }))}
                    className="input-field" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-surface-300 uppercase tracking-wider mb-2">Cover Image URL</label>
                <input 
                  type="text" 
                  value={newPost.image}
                  onChange={(e) => setNewPost(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="https://images.unsplash.com/photo-..." 
                  className="input-field" 
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-surface-300 uppercase tracking-wider mb-2">Brief Summary (2-3 lines)</label>
                <textarea 
                  required
                  rows={2}
                  value={newPost.summary}
                  onChange={(e) => setNewPost(prev => ({ ...prev, summary: e.target.value }))}
                  placeholder="Summarize the core takeaways of this publication..." 
                  className="input-field py-2"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-surface-300 uppercase tracking-wider mb-2">Complete Content</label>
                <textarea 
                  required
                  rows={6}
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write full article here. Use double linebreaks to separate paragraphs." 
                  className="input-field py-2 font-sans"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full btn-primary !py-3 !text-xs font-bold"
                >
                  Publish Article Live
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogsPage;
