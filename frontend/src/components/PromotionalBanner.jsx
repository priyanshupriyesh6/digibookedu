import React, { useEffect, useRef, useContext } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import horizontalBanner from '../assets/logos/horizontalbanner.jpeg';
import { AppContext } from '../context/AppContext';

gsap.registerPlugin(ScrollTrigger);

const PromotionalBanner = () => {
  const bannerRef = useRef(null);
  const { logActivity } = useContext(AppContext);

  useEffect(() => {
    gsap.fromTo(
      bannerRef.current,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        scrollTrigger: {
          trigger: bannerRef.current,
          start: 'top 85%',
          once: true,
        },
      }
    );
  }, []);

  return (
    <section className="px-6 md:px-[8%] lg:px-[10%] py-12" ref={bannerRef}>
      <div className="relative overflow-hidden rounded-3xl bg-surface-50 border border-primary/20 backdrop-blur-xl group hover:border-primary/40 transition-all duration-500 shadow-2xl">
        {/* Subtle decorative overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-surface/30 via-transparent to-surface/30 opacity-40 pointer-events-none z-10" />
        
        {/* Banner container */}
        <div className="relative h-[200px] sm:h-[280px] md:h-[380px] lg:h-[420px] overflow-hidden">
          <img
            src={horizontalBanner}
            alt="DigiBookEdu Special Banner"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
          />
          
          {/* Decorative glassmorphic badge */}
          <div className="absolute bottom-6 left-6 z-20 glass-card px-4 py-2 border border-white/10 hidden sm:block animate-float">
            <span className="text-white text-xs font-bold uppercase tracking-wider">🔥 Academy Special</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromotionalBanner;
