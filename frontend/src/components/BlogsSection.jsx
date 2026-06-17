import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const BlogsSection = () => {
  const { blogs } = useContext(AppContext);

  return (
    <section id="blogs" className="section-padding bg-surface">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="badge bg-primary/20 text-primary mb-3">News & Articles</span>
        <h2 className="section-title">Latest Updates & Academic Blogs</h2>
        <p className="section-subtitle mx-auto">
          Insights, tutorials, and security newsletters compiled by our expert instructors to keep you ahead in your educational path.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <article 
            key={blog.id} 
            className="glass-card overflow-hidden hover:shadow-card-hover hover:-translate-y-2 transition-all duration-300 border border-surface-100 flex flex-col h-full group"
          >
            {/* Cover Image */}
            <div className="relative overflow-hidden aspect-[16/10] shrink-0">
              <img 
                src={blog.image} 
                alt={blog.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              />
              <span className="absolute top-4 left-4 badge bg-surface/90 backdrop-blur-md text-white font-bold border border-white/10 uppercase tracking-wider text-[9px]">
                {blog.category}
              </span>
            </div>

            {/* Content Info */}
            <div className="p-6 flex flex-col flex-grow space-y-4">
              <div className="flex items-center gap-3 text-[11px] text-surface-400 font-semibold">
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
                  onClick={() => alert(`Full article reader modal is a premium feature! Coming soon.`)}
                  className="hover:underline flex items-center gap-1"
                >
                  Read Article ➔
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default BlogsSection;
