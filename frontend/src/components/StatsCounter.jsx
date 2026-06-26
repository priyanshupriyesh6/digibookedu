import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { label: 'Active Learners', value: '20+', icon: '🎓' },
  { label: 'New Enrollments', value: '25+', icon: '📚' },
  { label: 'Certified Instructors', value: '5+', icon: '👨‍🏫' },
  { label: 'Success Rate', value: '90%', icon: '🏆' },
  { label: 'Average Rating', value: '4.5', icon: '⭐' },
];

const StatsCounter = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      sectionRef.current.querySelectorAll('.stat-item'),
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="relative py-16 px-6 md:px-[10%]">
      <div className="glass-card p-8 md:p-12 rounded-3xl">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-item text-center group">
              <div className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-300">{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-bold gradient-text leading-none">
                {stat.value}
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
