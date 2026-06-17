import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: '👨‍🏫',
    title: 'Expert Instructors',
    desc: 'Learn from industry professionals with 10+ years of real-world experience in top MNCs.',
  },
  {
    icon: '🔄',
    title: 'Flexible Learning',
    desc: 'Self-paced courses with lifetime access. Learn anytime, anywhere, on any device.',
  },
  {
    icon: '🎓',
    title: 'Verified Certification',
    desc: 'Earn industry-recognized certificates that boost your resume and career prospects.',
  },
  {
    icon: '🚀',
    title: 'Career Support',
    desc: 'Dedicated placement assistance, resume reviews, and mock interview preparation.',
  },
];

const WhyChooseUs = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    gsap.fromTo(
      cardsRef.current,
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      }
    );
  }, []);

  const addToRefs = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  return (
    <section id="about" ref={sectionRef} className="section-padding">
      <div className="flex flex-col lg:flex-row gap-16 items-center">
        {/* Left Side */}
        <div className="flex-1">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Why DigiBookEdu</p>
          <h2 className="section-title mb-6">
            Why Students <span className="gradient-text">Choose Us</span>
          </h2>
          <p className="text-surface-400 text-lg leading-relaxed mb-8">
            We combine cutting-edge technology with expert instruction to deliver
            an unmatched learning experience. Our immersive 3D platform and
            industry-aligned curriculum set us apart from traditional education.
          </p>
          <div className="flex items-center gap-6">
            <button className="btn-primary">Learn More</button>
            <a href="#" className="flex items-center gap-2 text-surface-400 hover:text-white transition-colors group">
              <span className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                ▶
              </span>
              <span className="text-sm font-medium">Watch Video</span>
            </a>
          </div>
        </div>

        {/* Right Side - Feature Cards */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              ref={addToRefs}
              className="glass-card card-hover p-6 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-surface-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
