import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { SignInButton, SignUpButton } from '@clerk/clerk-react';

const LoginModal = ({ isOpen, onClose }) => {
  const { login, register } = useContext(AppContext);
  const [isSignUp, setIsSignUp] = useState(false);
  const [activeTab, setActiveTab] = useState('student'); // 'student' or 'teacher' for login/registration
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showLocalLogin, setShowLocalLogin] = useState(false);

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
    } else if (role === 'marketing') {
      testEmail = 'marketing@digibookedu.com';
      testPassword = 'marketing123';
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
    setShowLocalLogin(false);
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

        {!showLocalLogin ? (
          <div className="space-y-4">
            <div className="text-center text-xs text-surface-300 mb-2">
              Sign in securely using Clerk Authentication
            </div>
            
            <SignInButton mode="modal">
              <button 
                type="button"
                className="w-full py-3.5 bg-primary text-white rounded-xl font-bold text-sm transition-all duration-300 hover:shadow-glow hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                🔐 Sign In with Clerk
              </button>
            </SignInButton>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setShowLocalLogin(true)}
                className="text-xs text-accent hover:underline font-bold"
              >
                Or use legacy developer login →
              </button>
            </div>
          </div>
        ) : (
          <>
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

            {/* Login/Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
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
                {`Sign In to ${activeTab === 'student' ? 'Student' : 'Faculty'} Portal`}
              </button>
            </form>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowLocalLogin(false);
                  setError('');
                }}
                className="text-xs text-accent hover:underline font-bold"
              >
                ← Back to Clerk authentication
              </button>
            </div>
          </>
        )}


        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-surface-100" />
          </div>
          <span className="relative bg-surface-50 px-3 text-[10px] font-bold text-surface-300 uppercase tracking-wider">
            Quick Testing logins
          </span>
        </div>

        {/* Quick Logins (Student, Teacher, Admin, Marketing) */}
        <div className="grid grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => handleQuickLogin('student')}
            className="flex flex-col items-center justify-center p-2 rounded-2xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors group text-center"
          >
            <span className="text-xl mb-0.5 group-hover:scale-110 transition-transform">🎓</span>
            <span className="text-white text-[9px] font-bold">Student</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('teacher')}
            className="flex flex-col items-center justify-center p-2 rounded-2xl border border-accent/20 bg-accent/5 hover:bg-accent/10 transition-colors group text-center"
          >
            <span className="text-xl mb-0.5 group-hover:scale-110 transition-transform">👨‍🏫</span>
            <span className="text-white text-[9px] font-bold">Teacher</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('admin')}
            className="flex flex-col items-center justify-center p-2 rounded-2xl border border-warning/20 bg-warning/5 hover:bg-warning/10 transition-colors group text-center"
          >
            <span className="text-xl mb-0.5 group-hover:scale-110 transition-transform">👑</span>
            <span className="text-white text-[9px] font-bold">Admin</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('marketing')}
            className="flex flex-col items-center justify-center p-2 rounded-2xl border border-success/20 bg-success/5 hover:bg-success/10 transition-colors group text-center"
          >
            <span className="text-xl mb-0.5 group-hover:scale-110 transition-transform">📢</span>
            <span className="text-white text-[9px] font-bold">Marketing</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
