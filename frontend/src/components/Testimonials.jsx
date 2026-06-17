import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { testimonials } from '../data/courses';

gsap.registerPlugin(ScrollTrigger);

const Testimonials = () => {
  const [active, setActive] = useState(0);
  const sectionRef = useRef(null);
  const cardRef = useRef(null);

  // Auto-rotate
  useEffect(() => {
    const interval = setInterval(() => {
      setActive(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Animate on change
  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' });
    }
  }, [active]);

  const t = testimonials[active];

  return (
    <section id="testimonials" ref={sectionRef} className="section-padding bg-surface-50/50">
      <div className="text-center mb-16">
        <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Testimonials</p>
        <h2 className="section-title mx-auto">
          What Our <span className="gradient-text">Students</span> Say
        </h2>
      </div>

      <div className="max-w-3xl mx-auto">
        <div ref={cardRef} className="glass-card p-8 md:p-12 text-center">
          {/* Quote Icon */}
          <div className="text-primary/30 text-6xl leading-none mb-6">"</div>

          {/* Quote */}
          <p className="text-surface-500 text-lg md:text-xl leading-relaxed mb-8 italic">
            {t.quote}
          </p>

          {/* Rating */}
          <div className="flex justify-center gap-1 mb-6">
            {Array.from({ length: t.rating }).map((_, i) => (
              <span key={i} className="text-warning text-xl">★</span>
            ))}
          </div>

          {/* Avatar + Info */}
          <div className="flex items-center justify-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
              {t.avatar}
            </div>
            <div className="text-left">
              <p className="text-white font-semibold">{t.name}</p>
              <p className="text-surface-400 text-sm">{t.role} at {t.company}</p>
            </div>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-3 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i === active
                  ? 'bg-primary w-8'
                  : 'bg-surface-100 hover:bg-surface-200'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
