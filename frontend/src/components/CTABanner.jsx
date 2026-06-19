import React, { useEffect, useRef, useContext } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AppContext } from '../context/AppContext';

gsap.registerPlugin(ScrollTrigger);

const CTABanner = () => {
  const sectionRef = useRef(null);
  const { logActivity } = useContext(AppContext);

  useEffect(() => {
    gsap.fromTo(
      sectionRef.current,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          once: true,
        },
      }
    );
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="py-20 px-6 md:px-[10%]">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-600 to-accent p-10 md:p-16">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
          {/* Left - Text */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Start Your Learning Journey Today
            </h2>
            <p className="text-white/80 text-lg max-w-lg mb-6">
              Enroll in a free demo class and experience our immersive 3D learning platform.
              No credit card required.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <a
                href="https://wa.me/918744013901"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  if (logActivity) logActivity('CLICK', 'Clicked Connect on WhatsApp link');
                }}
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba56] text-white px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-105 shadow-lg shadow-[#25D366]/20"
              >
                <span className="text-base">💬</span> Connect on WhatsApp
              </a>
              <a 
                href="tel:+918744013901"
                onClick={() => {
                  if (logActivity) logActivity('CLICK', 'Clicked Call link: +91 87440 13901');
                }}
                className="text-white/80 hover:text-white text-xs font-semibold underline transition-colors"
              >
                Or Call: +91 87440 13901
              </a>
            </div>
          </div>

          {/* Right - Form */}
          <div className="flex-1 w-full max-w-md">
            <div className="bg-surface/40 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/10">
              <h3 className="text-white font-semibold text-lg mb-6 text-center">Have Questions? Speak to an Admissions Counselor</h3>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Admissions callback requested!");
                  if (logActivity) logActivity('CLICK', 'Submitted Admissions Counselor callback form');
                }}
                className="space-y-4"
              >
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  className="input-field !bg-white/10 !border-white/20"
                />
                <input
                  type="tel"
                  required
                  placeholder="Phone Number"
                  className="input-field !bg-white/10 !border-white/20"
                />
                <select required className="input-field !bg-white/10 !border-white/20 appearance-none">
                  <option value="" className="bg-surface">Select Course</option>
                  <option value="cyber" className="bg-surface">6-Month Master Diploma in Cybersecurity</option>
                  <option value="programming" className="bg-surface">Advanced Programming & Software Engineering</option>
                </select>
                <textarea
                  required
                  placeholder="Message"
                  rows="3"
                  className="input-field !bg-white/10 !border-white/20"
                />
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-white text-primary font-bold text-sm hover:bg-white/90 transition-all duration-200 hover:-translate-y-0.5"
                >
                  Request Call Back
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
