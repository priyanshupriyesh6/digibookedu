import React from 'react';

const CourseCard = ({ course }) => {
  const levelClass =
    course.level === 'Beginner'
      ? 'badge-beginner'
      : course.level === 'Intermediate'
      ? 'badge-intermediate'
      : 'badge-advanced';

  return (
    <div className="glass-card card-hover overflow-hidden group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-surface-100">
        {course.image ? (
          <img 
            src={course.image} 
            alt={course.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <div className="text-6xl group-hover:scale-110 transition-transform duration-500">
              {course.category === 'Cybersecurity' && '🛡️'}
              {course.category === 'Web Development' && '🌐'}
              {course.category === 'Data Science' && '📊'}
              {course.category === 'AI & ML' && '🤖'}
              {course.category === 'Cloud Computing' && '☁️'}
            </div>
          </div>
        )}
        {/* Level Badge */}
        <div className="absolute top-4 left-4">
          <span className={levelClass}>{course.level}</span>
        </div>
        {/* Discount Badge */}
        <div className="absolute top-4 right-4">
          <span className="badge bg-danger/90 text-white">
            {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category */}
        <p className="text-primary text-xs font-semibold uppercase tracking-wider mb-2">{course.category}</p>

        {/* Title */}
        <h3 className="text-white font-semibold text-lg mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>

        {/* Instructor */}
        <p className="text-surface-300 text-sm mb-4">by {course.instructor}</p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-surface-400 text-xs mb-4">
          <span className="flex items-center gap-1">📖 {course.lessons} Lessons</span>
          <span className="flex items-center gap-1">⏱️ {course.duration}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={`text-sm ${i < Math.floor(course.rating) ? 'text-warning' : 'text-surface-200'}`}>
                ★
              </span>
            ))}
          </div>
          <span className="text-white text-sm font-semibold">{course.rating}</span>
          <span className="text-surface-400 text-xs">({course.students.toLocaleString()} students)</span>
        </div>

        {/* Divider */}
        <div className="border-t border-surface-100 pt-4 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-white font-bold text-xl">₹{course.price.toLocaleString()}</span>
            <span className="text-surface-300 text-sm line-through">₹{course.originalPrice.toLocaleString()}</span>
          </div>
          <button className="text-primary hover:text-accent text-sm font-semibold transition-colors">
            Enroll →
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
