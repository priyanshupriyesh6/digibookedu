import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

const LoginModal = ({ isOpen, onClose }) => {
  const { login, register } = useContext(AppContext);
  const [isSignUp, setIsSignUp] = useState(false);
  const [activeTab, setActiveTab] = useState('student'); // 'student' or 'teacher' for login/registration
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email || !password || (isSignUp && !name)) {
      setError('Please fill in all fields.');
      return;
    }

    if (isSignUp) {
      const res = await register(name, email, password, activeTab);
      if (res.success) {
        setSuccess('Account created successfully! Redirecting...');
        setTimeout(() => {
          onClose();
          resetForm();
        }, 1200);
      } else {
        setError(res.message);
      }
    } else {
      const res = await login(email, password);
      if (res.success) {
        setSuccess('Logged in successfully! Redirecting...');
        setTimeout(() => {
          onClose();
          resetForm();
        }, 1200);
      } else {
        setError(res.message);
      }
    }
  };

  const handleQuickLogin = async (role) => {
    setError('');
    setSuccess('');
    let testEmail = 'student@digibookedu.com';
    let testPassword = 'password123';
    if (role === 'teacher') {
      testEmail = 'teacher@digibookedu.com';
    } else if (role === 'admin') {
      testEmail = 'priyanshupriyesh@gmail.com';
      testPassword = 'Shub@140404';
    }

    const res = await login(testEmail, testPassword);
    if (res.success) {
      setSuccess(`Authenticated as ${role}! Redirecting...`);
      setTimeout(() => {
        onClose();
        resetForm();
      }, 1000);
    } else {
      setError(res.message);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setError('');
    setSuccess('');
    setIsSignUp(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
        onClick={() => {
          onClose();
          resetForm();
        }}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-surface-50/95 border border-surface-100/50 backdrop-blur-2xl rounded-3xl p-8 shadow-glow overflow-hidden animate-scale-up z-10">
        {/* Glow Effects */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>🔑</span> {isSignUp ? 'Create Account' : 'Portal Login'}
          </h2>
          <button 
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="text-surface-300 hover:text-white text-xl p-1 hover:bg-white/5 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Buttons (Role Selection) */}
        <div className="grid grid-cols-2 bg-surface/50 border border-surface-100 rounded-xl p-1.5 mb-6">
          <button
            type="button"
            onClick={() => {
              setActiveTab('student');
              setError('');
            }}
            className={`py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
              activeTab === 'student' 
                ? 'bg-primary text-white shadow-md' 
                : 'text-surface-300 hover:text-white'
            }`}
          >
            🎓 Student Role
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('teacher');
              setError('');
            }}
            className={`py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
              activeTab === 'teacher' 
                ? 'bg-accent text-surface font-bold shadow-md' 
                : 'text-surface-300 hover:text-white'
            }`}
          >
            👨‍🏫 Faculty Role
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs text-center font-semibold animate-pulse-slow">
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded-xl bg-success/10 border border-success/20 text-success text-xs text-center font-semibold">
            ✓ {success}
          </div>
        )}

        {/* Login/Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-[10px] font-bold text-surface-300 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                className="input-field text-xs"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-surface-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={activeTab === 'student' ? 'student@digibookedu.com' : 'teacher@digibookedu.com'}
              className="input-field text-xs"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-surface-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field text-xs"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 hover:-translate-y-0.5 shadow-md ${
              activeTab === 'student'
                ? 'bg-primary text-white hover:shadow-glow'
                : 'bg-accent text-surface hover:shadow-lg'
            }`}
          >
            {isSignUp 
              ? `Sign Up as ${activeTab === 'student' ? 'Student' : 'Instructor'}` 
              : `Sign In to ${activeTab === 'student' ? 'Student' : 'Faculty'} Portal`}
          </button>
        </form>

        {/* Toggle between login and registration */}
        <p className="text-center text-xs text-surface-300 mt-4">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button 
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            className="text-accent hover:underline font-bold"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-surface-100" />
          </div>
          <span className="relative bg-surface-50 px-3 text-[10px] font-bold text-surface-300 uppercase tracking-wider">
            Quick Testing logins
          </span>
        </div>

        {/* Quick Logins (Student, Teacher, Admin) */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleQuickLogin('student')}
            className="flex flex-col items-center justify-center p-2 rounded-2xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors group text-center"
          >
            <span className="text-xl mb-0.5 group-hover:scale-110 transition-transform">🎓</span>
            <span className="text-white text-[10px] font-bold">Student</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('teacher')}
            className="flex flex-col items-center justify-center p-2 rounded-2xl border border-accent/20 bg-accent/5 hover:bg-accent/10 transition-colors group text-center"
          >
            <span className="text-xl mb-0.5 group-hover:scale-110 transition-transform">👨‍🏫</span>
            <span className="text-white text-[10px] font-bold">Teacher</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('admin')}
            className="flex flex-col items-center justify-center p-2 rounded-2xl border border-warning/20 bg-warning/5 hover:bg-warning/10 transition-colors group text-center"
          >
            <span className="text-xl mb-0.5 group-hover:scale-110 transition-transform">👑</span>
            <span className="text-white text-[10px] font-bold">Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
