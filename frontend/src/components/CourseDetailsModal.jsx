import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';

const CourseDetailsModal = ({ course, onClose }) => {
  const overlayRef = useRef(null);
  const modalRef = useRef(null);

  // Parse module title into Prefix, Title, and Description
  const parseModule = (titleStr) => {
    const parts = titleStr.split(':');
    if (parts.length >= 3) {
      return {
        prefix: parts[0].trim(),
        title: parts[1].trim(),
        description: parts.slice(2).join(':').trim()
      };
    } else if (parts.length === 2) {
      return {
        prefix: parts[0].trim(),
        title: parts[1].trim(),
        description: ''
      };
    } else {
      return {
        prefix: '',
        title: titleStr.trim(),
        description: ''
      };
    }
  };

  // Generate WhatsApp message based on course title
  const getWhatsAppLink = () => {
    const phone = '9319776904';
    let message = `Hi, I am interested in the course: ${course.title}. Please provide more details.`;

    if (course.title.includes('Python')) {
      message = 'Hi, I would like to enroll in the Python Learning Program and get started with programming.';
    } else if (course.title.includes('CHFI') || course.title.toLowerCase().includes('forensic')) {
      message = 'Hi, I would like to enroll in the CHFI (Computer hacking forensic investigator) program and access the forensic labs.';
    } else if (course.title.includes('CEH v12 Pro') || course.title.includes('CEHv12 Pro')) {
      message = 'Hi, I would like to enroll in the CEH v12 Pro Course and get started with advanced security testing.';
    } else if (course.title.includes('CEH V12 Basic') || course.title.includes('CEH v12 Basic')) {
      message = 'Hi, I would like to enroll in the CEH V12 Basic course and learn ethical hacking fundamentals.';
    } else if (course.title.includes('CEHv12') && course.title.includes('Theory')) {
      message = 'Hi, I would like to access the full CEHv12 Theory Masterclass Resource Syllabus.';
    } else if (course.title.includes('Reference Library') || course.title.includes('Dumps Vault')) {
      message = 'Hi, I would like to request access credentials for the CEH Premium Reference Library.';
    } else if (course.title.includes('Artificial Intelligence') || course.title.includes('Predictive Engineering')) {
      message = 'Hi, I would like to apply for the next Artificial Intelligence & Predictive Engineering batch.';
    }

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  // Escape key listener to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden'; // Lock background scrolling

    // Animate Modal Open
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
    gsap.fromTo(modalRef.current, { scale: 0.9, y: 20, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 0.4, delay: 0.1, ease: 'back.out(1.2)' });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = ''; // Unlock background scrolling
    };
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  const levelClass =
    course.level === 'Beginner'
      ? 'badge-beginner'
      : course.level === 'Intermediate'
      ? 'badge-intermediate'
      : 'badge-advanced';

  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4 md:p-6"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-surface-50 border border-primary/20 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col p-6 md:p-10 text-white scrollbar-thin scrollbar-thumb-primary scrollbar-track-surface"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 rounded-full flex items-center justify-center bg-surface-100 hover:bg-surface-200 border border-white/10 text-white/70 hover:text-white transition-all duration-200 z-10"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Hero Section */}
        <div className="mb-8 border-b border-surface-100 pb-6 pr-8">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className={levelClass}>{course.level}</span>
            <span className="badge bg-primary/20 text-primary border border-primary/30">{course.category}</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white mb-3">
            {course.title}
          </h1>
          {course.headline && (
            <h2 className="text-lg md:text-xl font-semibold text-accent mb-2">
              {course.headline}
            </h2>
          )}
          {course.subtext && (
            <p className="text-surface-300 text-sm md:text-base leading-relaxed">
              {course.subtext}
            </p>
          )}
        </div>

        {/* Course Metadata Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-surface-100/50 border border-white/5 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-surface-400 text-xs font-semibold uppercase tracking-wider">Academy Segment</span>
            <span className="text-white text-sm font-bold mt-2">{course.segment || 'Cyber Security'}</span>
          </div>
          <div className="bg-surface-100/50 border border-white/5 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-surface-400 text-xs font-semibold uppercase tracking-wider">Training Timeline</span>
            <span className="text-white text-sm font-bold mt-2">{course.duration || '6 Months'}</span>
          </div>
          <div className="bg-surface-100/50 border border-white/5 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-surface-400 text-xs font-semibold uppercase tracking-wider">Interactive Element</span>
            <span className="text-white text-sm font-bold mt-2">{course.interactiveElement || 'Active Practice Labs'}</span>
          </div>
          <div className="bg-surface-100/50 border border-white/5 rounded-xl p-4 flex flex-col justify-between border-primary/20 bg-primary/5">
            <span className="text-primary text-xs font-semibold uppercase tracking-wider">Action Trigger</span>
            <span className="text-white text-sm font-bold mt-2">{course.actionTrigger || 'Enroll & Claim Lab Pass'}</span>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left / Main Column: Syllabus Modules */}
          <div className="lg:col-span-2 space-y-8">
            {/* Highlights (What You'll Learn) */}
            {course.highlights && course.highlights.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span>💡</span> Course Highlights
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {course.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-surface-100/20 border border-white/5 rounded-xl p-3.5 hover:bg-surface-100/35 hover:border-primary/20 transition-all duration-300 group">
                      <span className="text-primary text-sm font-extrabold shrink-0 group-hover:scale-110 transition-transform">✓</span>
                      <span className="text-surface-300 text-xs md:text-sm leading-relaxed">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills You'll Gain */}
            {course.skills && course.skills.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span>🛡️</span> Skills You'll Gain
                </h3>
                <div className="flex flex-wrap gap-2">
                  {course.skills.map((skill, idx) => (
                    <span key={idx} className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-primary/10 to-accent/15 border border-primary/20 hover:border-primary/50 text-xs text-white font-semibold transition-all duration-300 cursor-default hover:-translate-y-0.5">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tools Covered */}
            {course.tools && course.tools.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span>🛠️</span> Tools Covered
                </h3>
                <div className="flex flex-wrap gap-2">
                  {course.tools.map((tool, idx) => (
                    <span key={idx} className="px-4 py-2 rounded-xl bg-surface border border-white/10 hover:border-accent/40 text-xs text-accent font-bold font-mono transition-all duration-300 hover:scale-105 hover:shadow-glow hover:shadow-accent/5">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Ideal For */}
            {course.idealFor && course.idealFor.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span>🎯</span> Ideal For
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {course.idealFor.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs md:text-sm text-surface-300 bg-surface-100/10 border border-white/5 rounded-xl py-3 px-4">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>📖</span> Course Syllabus & Modules
              </h3>
              <div className="space-y-4">
              {course.modules && course.modules.length > 0 ? (
                course.modules.map((mod, index) => {
                  const parsed = parseModule(mod.title);
                  return (
                    <div
                      key={index}
                      className="bg-surface-100/30 border border-white/5 rounded-xl p-5 hover:border-primary/30 transition-all duration-300 group"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-xs font-semibold">
                            {parsed.prefix}
                          </span>
                          <h4 className="text-white font-bold text-sm md:text-base group-hover:text-primary transition-colors">
                            {parsed.title}
                          </h4>
                        </div>
                        {mod.duration && (
                          <span className="text-surface-400 text-xs flex items-center gap-1 font-medium">
                            ⏱️ {mod.duration}
                          </span>
                        )}
                      </div>
                      {parsed.description && (
                        <p className="text-surface-300 text-xs md:text-sm leading-relaxed mt-1">
                          {parsed.description}
                        </p>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-surface-400 text-sm">Syllabus modules are currently being loaded.</p>
              )}
            </div>
          </div>
        </div>

          {/* Right Column: Overview, Outcomes, and Actions */}
          <div className="flex flex-col gap-6">
            {/* Overview */}
            <div className="bg-surface-100/40 border border-white/5 rounded-xl p-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                ✍️ Program Overview
              </h3>
              <p className="text-surface-300 text-xs md:text-sm leading-relaxed">
                {course.overview || 'Understand the core dynamics of this professional certification program.'}
              </p>
            </div>

            {/* Outcomes & Career Impact */}
            <div className="bg-surface-100/40 border border-white/5 rounded-xl p-6 border-l-accent/50 border-l-4">
              <h3 className="text-sm font-bold text-accent uppercase tracking-wider mb-3">
                🎯 Outcomes & Career Impact
              </h3>
              {course.outcomes && (
                <div className="mb-4">
                  <h4 className="text-white font-semibold text-xs mb-1">Definitive Result:</h4>
                  <p className="text-surface-300 text-xs leading-relaxed">{course.outcomes}</p>
                </div>
              )}
              {course.careerMilestone && (
                <div>
                  <h4 className="text-white font-semibold text-xs mb-1">Career Milestone:</h4>
                  <p className="text-surface-300 text-xs leading-relaxed">{course.careerMilestone}</p>
                </div>
              )}
            </div>

            {/* Action Box */}
            <div className="bg-surface-100/50 border border-primary/20 rounded-xl p-6 text-center flex flex-col items-center justify-center">
              <span className="text-surface-400 text-xs mb-3 block">Ready to start? Secure your access path now:</span>
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba56] text-white px-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-[#25D366]/20"
              >
                <span className="text-base">💬</span> Enroll via WhatsApp
              </a>
              <span className="text-surface-400 text-[10px] mt-2 block">
                Connects directly with an Admissions Officer
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-surface-100">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-surface-100 hover:bg-surface-200 text-white font-semibold text-sm transition-all duration-200 border border-white/5"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CourseDetailsModal;
