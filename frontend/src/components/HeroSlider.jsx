import React, { useState, useEffect, useCallback } from 'react';

// ─── SLIDE DATA ────────────────────────────────────────────────────────────────
// Replace `image` with a real URL when you have photos ready.
// e.g.  image: '/images/slide1.jpg'  or  image: 'https://...'
const SLIDES = [
  {
    id: 1,
    image: '',
    badge: '🎓 New Batch Starting',
    title: 'Learn Cybersecurity',
    subtitle: 'From ethical hacking to network defence — hands-on labs included.',
    accent: 'from-[#192338]/80 to-[#31487A]/60',
  },
  {
    id: 2,
    image: '',
    badge: '🤖 AI & Machine Learning',
    title: 'Build the Future with AI',
    subtitle: 'Master Python, neural networks, and real-world ML pipelines.',
    accent: 'from-[#1E2E4F]/80 to-[#8FB3E2]/50',
  },
  {
    id: 3,
    image: '',
    badge: '🌐 Full Stack Web Dev',
    title: 'From Zero to Full-Stack',
    subtitle: 'React, Node, databases and cloud deployment in one track.',
    accent: 'from-[#31487A]/80 to-[#192338]/60',
  },
];

// ─── PLACEHOLDER SVG shown when no image is set ────────────────────────────
const PlaceholderSlide = ({ slide }) => (
  <div className="hero-slide-placeholder">
    <div className="placeholder-icon">
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="16" fill="rgba(99,179,237,0.08)" />
        <path d="M16 44 L24 32 L30 38 L38 26 L48 44 Z" fill="rgba(99,179,237,0.25)" stroke="rgba(99,179,237,0.5)" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="24" cy="24" r="5" fill="rgba(99,179,237,0.3)" stroke="rgba(99,179,237,0.6)" strokeWidth="1.5" />
        <rect x="8" y="8" width="48" height="48" rx="12" stroke="rgba(99,179,237,0.3)" strokeWidth="1.5" strokeDasharray="4 3" />
      </svg>
    </div>
    <p className="placeholder-label">Slide {slide.id}</p>
    <p className="placeholder-hint">Add an image URL in <code>HeroSlider.jsx</code></p>
  </div>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback((index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent(index);
      setIsTransitioning(false);
    }, 120);
  }, [isTransitioning]);

  const prev = () => goTo((current - 1 + SLIDES.length) % SLIDES.length);
  const next = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo]);

  // Auto-play every 5 seconds
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = SLIDES[current];

  return (
    <div className="hero-slider-root">
      {/* ── Slide Frame ── */}
      <div className={`hero-slide-frame ${isTransitioning ? 'slide-fade-out' : 'slide-fade-in'}`}>

        {/* Image layer */}
        {slide.image ? (
          <img src={slide.image} alt={slide.title} className="hero-slide-img" />
        ) : (
          <PlaceholderSlide slide={slide} />
        )}

        {/* Gradient overlay — always shown */}
        <div className={`hero-slide-overlay bg-gradient-to-br ${slide.accent}`} />

        {/* Slide content */}
        <div className="hero-slide-content">
          <span className="slide-badge">{slide.badge}</span>
          <h3 className="slide-title">{slide.title}</h3>
          <p className="slide-subtitle">{slide.subtitle}</p>
        </div>
      </div>

      {/* ── Controls ── */}
      <button className="slider-arrow slider-arrow-left" onClick={prev} aria-label="Previous slide">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button className="slider-arrow slider-arrow-right" onClick={next} aria-label="Next slide">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* ── Dot navigation ── */}
      <div className="slider-dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`slider-dot ${i === current ? 'slider-dot-active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* ── Progress bar ── */}
      <div className="slider-progress-track">
        <div key={current} className="slider-progress-bar" />
      </div>
    </div>
  );
};

export default HeroSlider;
