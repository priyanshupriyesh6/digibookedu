import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import HeroSlider from './HeroSlider';

const Hero = () => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(titleRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1 })
      .fromTo(subtitleRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.5')
      .fromTo(ctaRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.4')
      .fromTo(statsRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.3');
  }, []);

  return (
    <section id="home" ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/15 rounded-full blur-[128px]" />

      <div className="relative z-10 w-full px-6 md:px-[10%] flex flex-col lg:flex-row items-center gap-12 pt-20">
        {/* Left Content */}
        <div className="flex-1 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            #1 EdTech Platform for Future-Ready Skills
          </div>

          <h1 ref={titleRef} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 text-balance">
            Master Cyber Defense. <span className="gradient-text">Secure Your Future.</span>
          </h1>

          <p ref={subtitleRef} className="text-surface-400 text-lg md:text-xl mb-10 leading-relaxed max-w-xl">
            Join Meerut’s premier IT training institute. Get hands-on instruction with our elite CEH v12 Pro or CHFI tracks. Built for practical learning with live corporate lab tools.
          </p>

          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 mb-12">
            <a href="#courses" className="btn-primary text-center">
              Explore Programs
            </a>
            <a href="#contact" className="btn-secondary text-center">
              Take a Free Demo
            </a>
          </div>

          <div ref={statsRef} className="flex items-center gap-8 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {['🟣', '🔵', '🟢', '🟡'].map((dot, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-surface-50 border-2 border-surface flex items-center justify-center text-xs">
                    {dot}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">200+</p>
                <p className="text-surface-300 text-xs">Active Learners</p>
              </div>
            </div>
            <div className="h-8 w-px bg-surface-100" />
            <div>
              <p className="text-white font-semibold text-sm">4.9 ⭐</p>
              <p className="text-surface-300 text-xs">Average Rating</p>
            </div>
            <div className="h-8 w-px bg-surface-100" />
            <div>
              <p className="text-white font-semibold text-sm">5+</p>
              <p className="text-surface-300 text-xs">Courses Available</p>
            </div>
          </div>
        </div>

        {/* Right — Image Slider */}
        <div className="flex-1 w-full lg:w-auto h-[400px] md:h-[500px] lg:h-[580px] relative">
          <HeroSlider />
          {/* Floating badges */}
          <div className="absolute -top-4 -right-4 glass-card px-4 py-3 animate-float hidden md:block z-30">
            <p className="text-xs text-surface-400">Certified Course</p>
            <p className="text-white font-semibold text-sm">ISO Certified ✅</p>
          </div>
          <div className="absolute -bottom-4 -left-4 glass-card px-4 py-3 animate-float hidden md:block z-30" style={{ animationDelay: '2s' }}>
            <p className="text-xs text-surface-400">New Enrollment</p>
            <p className="text-white font-semibold text-sm">25+ this month 🚀</p>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface to-transparent" />
    </section>
  );
};

export default Hero;
