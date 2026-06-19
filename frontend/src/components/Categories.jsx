import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { categories } from '../data/courses';

gsap.registerPlugin(ScrollTrigger);

const Categories = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    if (cardsRef.current && cardsRef.current.length > 0) {
      gsap.fromTo(
        cardsRef.current,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
        }
      );
    }
  }, []);

  const addToRefs = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  return (
    <section id="categories" ref={sectionRef} className="section-padding bg-surface-50/50">
      <div className="text-center mb-16">
        <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Browse Topics</p>
        <h2 className="section-title mx-auto">
          Popular <span className="gradient-text">Categories</span>
        </h2>
        <p className="section-subtitle mx-auto text-center">
          Choose from a wide range of cutting-edge topics and start your learning journey today.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {categories.map(cat => (
          <div
            key={cat.id}
            ref={addToRefs}
            className="group glass-card card-hover p-6 text-center cursor-pointer"
          >
            <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
              {cat.icon}
            </div>
            <h3 className="text-white font-semibold mb-1 group-hover:text-primary transition-colors">{cat.name}</h3>
            <p className="text-surface-400 text-sm">{cat.count} Courses</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
