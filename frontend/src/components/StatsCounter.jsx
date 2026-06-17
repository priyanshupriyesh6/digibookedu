import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { label: 'Active Students', value: 15000, suffix: '+', icon: '🎓' },
  { label: 'Expert Courses', value: 200, suffix: '+', icon: '📚' },
  { label: 'Certified Instructors', value: 50, suffix: '+', icon: '👨‍🏫' },
  { label: 'Success Rate', value: 95, suffix: '%', icon: '🏆' },
];

const StatsCounter = () => {
  const sectionRef = useRef(null);
  const countersRef = useRef([]);

  useEffect(() => {
    countersRef.current.forEach((el, i) => {
      const target = stats[i].value;
      gsap.fromTo(
        el,
        { innerText: 0 },
        {
          innerText: target,
          duration: 2.5,
          ease: 'power2.out',
          snap: { innerText: 1 },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );
    });
  }, []);

  const addToRefs = (el) => {
    if (el && !countersRef.current.includes(el)) {
      countersRef.current.push(el);
    }
  };

  return (
    <section ref={sectionRef} className="relative py-16 px-6 md:px-[10%]">
      <div className="glass-card p-8 md:p-12 rounded-3xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div key={stat.label} className="text-center group">
              <div className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-300">{stat.icon}</div>
              <div className="flex items-center justify-center gap-1">
                <span
                  ref={addToRefs}
                  className="text-3xl md:text-4xl font-bold text-white"
                >
                  0
                </span>
                <span className="text-3xl md:text-4xl font-bold gradient-text">{stat.suffix}</span>
              </div>
              <p className="text-surface-400 text-sm mt-2 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;
