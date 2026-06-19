import React, { useState, useEffect, useRef, useContext } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CourseCard from './CourseCard';
import { AppContext } from '../context/AppContext';

gsap.registerPlugin(ScrollTrigger);

const filters = ['All', 'Cybersecurity', 'Programming'];

const FeaturedCourses = () => {
  const { courses } = useContext(AppContext);
  const [activeFilter, setActiveFilter] = useState('All');
  const sectionRef = useRef(null);
  const cardsRef = useRef(null);

  const filtered = activeFilter === 'All'
    ? courses
    : courses.filter(c => c.category === activeFilter);

  useEffect(() => {
    gsap.fromTo(
      sectionRef.current,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
      }
    );
  }, []);

  useEffect(() => {
    if (cardsRef.current && cardsRef.current.children.length > 0) {
      gsap.fromTo(
        cardsRef.current.children,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, [activeFilter, courses.length]);

  return (
    <section id="courses" ref={sectionRef} className="section-padding">
      <div className="text-center mb-16">
        <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Our Courses</p>
        <h2 className="section-title mx-auto">
          Explore <span className="gradient-text">Featured</span> Courses
        </h2>
        <p className="section-subtitle mx-auto text-center">
          Industry-aligned curriculum designed by experts. Learn at your own pace with hands-on projects.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeFilter === filter
                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                : 'bg-surface-50 text-surface-400 hover:text-white hover:bg-surface-100'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Course Grid */}
      <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {/* View All */}
      <div className="text-center mt-12">
        <button className="btn-secondary">
          View All Courses →
        </button>
      </div>
    </section>
  );
};

export default FeaturedCourses;
