import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import logoImg from '../assets/logos/logo.png';

const Footer = () => {
  const { setPortal, currentUser, login } = useContext(AppContext);

  const handlePortalLink = (role) => {
    if (currentUser && currentUser.role === role) {
      setPortal(role);
    } else {
      // Simulate quick login for portal link
      const email = role === 'student' ? 'student@digibookedu.com' : 'teacher@digibookedu.com';
      login(email, 'password123');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-surface-50 border-t border-surface-100">
      <div className="px-6 md:px-[10%] py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <img 
                src={logoImg} 
                alt="DigiBookEdu" 
                className="h-12 w-auto object-contain animate-float" 
              />
            </div>
            <p className="text-surface-400 leading-relaxed mb-6 max-w-sm text-sm">
              Empowering learners with industry-aligned courses in Cybersecurity,
              AI, Web Development & more. Join 15,000+ students building future-ready skills.
            </p>

            {/* Newsletter */}
            <div>
              <p className="text-white font-medium mb-3 text-sm">Subscribe to our newsletter</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input-field flex-1 !py-2.5 text-xs"
                />
                <button className="btn-primary !py-2.5 !px-5 !text-xs whitespace-nowrap">Subscribe</button>
              </div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#home" onClick={() => setPortal('landing')} className="text-surface-400 hover:text-primary transition-colors">Home</a></li>
              <li><a href="#about" onClick={() => setPortal('landing')} className="text-surface-400 hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#courses" onClick={() => setPortal('landing')} className="text-surface-400 hover:text-primary transition-colors">Our Courses</a></li>
              <li>
                <button 
                  onClick={() => handlePortalLink('student')} 
                  className="text-surface-400 hover:text-primary transition-colors text-left"
                >
                  Student Portal
                </button>
              </li>
              <li><a href="#contact" onClick={() => setPortal('landing')} className="text-surface-400 hover:text-primary transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Portals Column */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Access Portals</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <button 
                  onClick={() => handlePortalLink('student')} 
                  className="text-surface-400 hover:text-primary transition-colors text-left"
                >
                  🎓 Student Workspace
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handlePortalLink('teacher')} 
                  className="text-surface-400 hover:text-accent transition-colors text-left"
                >
                  👨‍🏫 Instructor Admin Portal
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handlePortalLink('student')} 
                  className="text-surface-400 hover:text-primary transition-colors text-left"
                >
                  📈 Student Progress Cards
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handlePortalLink('teacher')} 
                  className="text-surface-400 hover:text-accent transition-colors text-left"
                >
                  📝 Manage & Publish Course
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Topics Column */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Popular Topics</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#courses" onClick={() => setPortal('landing')} className="text-surface-400 hover:text-primary transition-colors">Cybersecurity Bootcamps</a></li>
              <li><a href="#courses" onClick={() => setPortal('landing')} className="text-surface-400 hover:text-primary transition-colors">Ethical Hacking</a></li>
              <li><a href="#courses" onClick={() => setPortal('landing')} className="text-surface-400 hover:text-primary transition-colors">React & Tailwind Web Dev</a></li>
              <li><a href="#courses" onClick={() => setPortal('landing')} className="text-surface-400 hover:text-primary transition-colors">Deep Learning & AI</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-surface-100 px-6 md:px-[10%] py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-surface-300 text-xs">
            © 2026 DigiBookEdu. All Rights Reserved to Priyanshu Priyesh.
          </p>

          {/* Social Icons */}
          <div className="flex gap-3">
            {['Facebook', 'Twitter', 'LinkedIn', 'YouTube', 'Instagram'].map(social => (
              <a
                key={social}
                href="#"
                className="w-8 h-8 rounded-lg bg-surface-100/50 flex items-center justify-center text-surface-400 hover:bg-primary hover:text-white text-xs transition-all duration-200"
                title={social}
              >
                {social[0]}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
