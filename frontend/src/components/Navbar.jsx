import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import LoginModal from './LoginModal';
import logoImg from '../assets/logos/logo.png';

const Navbar = () => {
  const { portal, setPortal, currentUser, logout, logActivity } = useContext(AppContext);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About Us', href: '#about' },
    { name: 'Our Courses', href: '#courses' },
    { name: 'Student Portal', href: '#portal' },
    { name: 'Blogs', href: '#blogs' },
    { name: 'Contact Us', href: '#contact' },
  ];

  const handleLogoClick = (e) => {
    e.preventDefault();
    setPortal('landing');
    if (logActivity) logActivity('CLICK', 'Clicked logo in navbar');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavLinkClick = (e, link) => {
    e.preventDefault();
    if (logActivity) logActivity('CLICK', `Clicked navigation link: "${link.name}"`);
    if (link.name === 'Student Portal') {
      if (currentUser) {
        setPortal(currentUser.role);
      } else {
        setIsLoginOpen(true);
      }
    } else if (link.name === 'Blogs') {
      setPortal('blogs');
    } else {
      if (portal !== 'landing') {
        setPortal('landing');
        setTimeout(() => {
          const target = document.querySelector(link.href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        const target = document.querySelector(link.href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <>
      {/* Top Info Bar - light blue */}
      <div className="bg-sky-500 text-white text-sm py-2 px-6 md:px-[10%] hidden md:block">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a href="tel:+919319776904" className="flex items-center gap-2 hover:text-accent transition-colors text-xs font-semibold">
              <span>📞</span> +91 93197 76904
            </a>
            <a href="mailto:digibookedu@gmail.com" className="flex items-center gap-2 hover:text-accent transition-colors text-xs font-semibold">
              <span>✉️</span> digibookedu@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <a href="#" className="hover:text-accent transition-colors">Facebook</a>
            <a href="#" className="hover:text-accent transition-colors">Twitter</a>
            <a href="#" className="hover:text-accent transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-accent transition-colors">YouTube</a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`sticky top-0 z-40 w-full transition-all duration-500 ${
        scrolled
          ? 'bg-sky-100/95 backdrop-blur-xl shadow-lg shadow-sky-200/40 py-3'
          : 'bg-sky-50/90 backdrop-blur-md py-5'
      }`}>
        <div className="px-4 md:px-[6%] lg:px-[8%] xl:px-[10%] flex items-center justify-between w-full">
          {/* Logo — pinned extreme left with responsive gap */}
          <a href="#home" onClick={handleLogoClick} className="flex items-center group mr-6 xl:mr-16 shrink-0">
            <img 
              src={logoImg} 
              alt="DigiBookEdu" 
              className="h-12 md:h-16 w-auto object-contain group-hover:scale-105 transition-transform shrink-0" 
            />
          </a>

          {/* Desktop Nav Links — centred and responsive gaps */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-8">
            {portal === 'landing' || portal === 'blogs' ? (
              navLinks.map(link => (
                <button
                  key={link.name}
                  onClick={(e) => handleNavLinkClick(e, link)}
                  className={`text-sky-800 hover:text-sky-600 text-sm font-semibold transition-colors duration-200 relative group whitespace-nowrap ${
                    (portal === 'blogs' && link.name === 'Blogs') || (portal === 'landing' && link.name === 'Home' && window.scrollY < 100)
                      ? '!text-sky-600'
                      : ''
                  }`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-accent transition-all duration-300 ${
                    (portal === 'blogs' && link.name === 'Blogs')
                      ? 'w-full'
                      : 'w-0 group-hover:w-full'
                  }`} />
                </button>
              ))
            ) : (
              <button
                onClick={() => setPortal('landing')}
                className="text-sky-700 hover:text-sky-900 text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <span>⬅️</span> Back to Main Website
              </button>
            )}
          </div>

          {/* Auth Buttons — right side */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 bg-surface border border-surface-100/50 hover:border-primary/50 py-1.5 px-3 rounded-xl transition-all duration-300 hover:shadow-glow"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center text-xs font-bold uppercase shadow-md">
                    {currentUser.avatar || (currentUser.role === 'student' ? '🎓' : currentUser.role === 'teacher' ? '👨‍🏫' : '👑')}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-white leading-none mb-0.5">{currentUser.name}</p>
                    <p className="text-[10px] text-surface-400 font-semibold leading-none capitalize">{currentUser.role} Portal</p>
                  </div>
                  <span className="text-surface-400 text-xs ml-1">▼</span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-surface-50 border border-surface-100/60 rounded-2xl p-2 shadow-2xl animate-slide-up z-50">
                    <button
                      onClick={() => {
                        setPortal(currentUser.role);
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-white hover:bg-primary/20 rounded-xl transition-colors font-semibold flex items-center gap-2"
                    >
                      <span>💻</span> Dashboard Portal
                    </button>
                    <button
                      onClick={() => {
                        setPortal('landing');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-white hover:bg-white/5 rounded-xl transition-colors font-semibold flex items-center gap-2"
                    >
                      <span>🌐</span> View Main Site
                    </button>
                    <hr className="border-surface-100/50 my-1.5" />
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-danger hover:bg-danger/10 rounded-xl transition-colors font-semibold flex items-center gap-2"
                    >
                      <span>🚪</span> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Sign In + Get Started — always one line */
              <div className="flex items-center gap-2 whitespace-nowrap">
                <button
                  onClick={() => {
                    setIsLoginOpen(true);
                    if (logActivity) logActivity('CLICK', 'Clicked Sign In button in navbar');
                  }}
                  className="btn-secondary !py-2.5 !px-6 !text-xs whitespace-nowrap"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setIsLoginOpen(true);
                    if (logActivity) logActivity('CLICK', 'Clicked Get Started button in navbar');
                  }}
                  className="btn-primary !py-2.5 !px-6 !text-xs whitespace-nowrap"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden text-white text-2xl"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-surface-50 border-t border-surface-100 px-6 py-6 space-y-4 animate-slide-up">
            {portal === 'landing' || portal === 'blogs' ? (
              navLinks.map(link => (
                <button
                  key={link.name}
                  className="block w-full text-left text-surface-400 hover:text-white font-medium transition-colors py-1"
                  onClick={(e) => {
                    handleNavLinkClick(e, link);
                    setMobileOpen(false);
                  }}
                >
                  {link.name}
                </button>
              ))
            ) : (
              <button
                onClick={() => {
                  setPortal('landing');
                  setMobileOpen(false);
                }}
                className="w-full text-left text-surface-300 hover:text-white font-medium transition-colors flex items-center gap-2 py-2"
              >
                <span>⬅️</span> Back to Main Website
              </button>
            )}

            {currentUser ? (
              <div className="pt-4 border-t border-surface-100 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center text-sm font-bold uppercase">
                    {currentUser.avatar || (currentUser.role === 'student' ? '🎓' : currentUser.role === 'teacher' ? '👨‍🏫' : '👑')}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{currentUser.name}</p>
                    <p className="text-xs text-surface-400 capitalize">{currentUser.role} Account</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setPortal(currentUser.role);
                    setMobileOpen(false);
                  }}
                  className="btn-primary w-full !py-2.5 !text-xs"
                >
                  Go to Portal
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-xs text-danger font-semibold hover:bg-danger/5 rounded-xl border border-danger/10"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex gap-3 pt-4 border-t border-surface-100">
                <button 
                  onClick={() => {
                    setIsLoginOpen(true);
                    setMobileOpen(false);
                    if (logActivity) logActivity('CLICK', 'Clicked Sign In button in mobile menu');
                  }} 
                  className="btn-secondary flex-1 !py-2.5 !text-xs"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => {
                    setIsLoginOpen(true);
                    setMobileOpen(false);
                    if (logActivity) logActivity('CLICK', 'Clicked Register button in mobile menu');
                  }} 
                  className="btn-primary flex-1 !py-2.5 !text-xs"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Embedded Login Modal */}
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />
    </>
  );
};

export default Navbar;
