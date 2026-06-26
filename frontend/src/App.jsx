import React, { useContext } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StatsCounter from './components/StatsCounter';
import FeaturedCourses from './components/FeaturedCourses';
import Categories from './components/Categories';
import PromotionalBanner from './components/PromotionalBanner';
import WhyChooseUs from './components/WhyChooseUs';
import Testimonials from './components/Testimonials';
import CTABanner from './components/CTABanner';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import StudentPortal from './components/StudentPortal';
import TeacherPortal from './components/TeacherPortal';
import AdminPortal from './components/AdminPortal';
import MarketingPortal from './components/MarketingPortal';
import BlogsPage from './components/BlogsPage';
import { ClerkProvider } from '@clerk/clerk-react';
import DiagnosticsPanel from './components/DiagnosticsPanel';
import './index.css';

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function AppContent() {
  const { portal, logActivity } = useContext(AppContext);

  if (portal === 'student') {
    return <StudentPortal />;
  }

  if (portal === 'teacher') {
    return <TeacherPortal />;
  }

  if (portal === 'admin') {
    return <AdminPortal />;
  }

  if (portal === 'marketing') {
    return <MarketingPortal />;
  }

  const renderWhatsAppWidget = () => (
    <div className="fixed bottom-24 right-8 z-50 group">
      {/* Tooltip */}
      <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-surface-50 border border-primary/20 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-xl translate-x-2 group-hover:translate-x-0">
        Chat with Us Instantly
      </div>
      <a
        href="https://wa.me/918744013901"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          if (logActivity) logActivity('CLICK', 'Clicked floating WhatsApp button');
        }}
        className="w-14 h-14 bg-[#25D366] hover:bg-[#20ba56] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/20 transition-all duration-300 hover:scale-110 active:scale-95"
      >
        <span className="text-2xl">💬</span>
      </a>
    </div>
  );

  if (portal === 'blogs') {
    return (
      <div className="min-h-screen flex flex-col bg-surface text-white">
        <Navbar />
        <main className="flex-1">
          <BlogsPage />
        </main>
        <Footer />
        {renderWhatsAppWidget()}
        <ScrollToTop />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface text-white">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <StatsCounter />
        <FeaturedCourses />
        <Categories />
        <PromotionalBanner />
        <WhyChooseUs />
        <Testimonials />
        <CTABanner />
      </main>
      <Footer />
      {renderWhatsAppWidget()}
      <ScrollToTop />
    </div>
  );
}

function App() {
  if (!CLERK_PUBLISHABLE_KEY) {
    console.warn("Clerk Publishable Key is missing! Clerk Auth will not work.");
  }
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY || ""}>
      <AppProvider>
        <AppContent />
        <DiagnosticsPanel />
        <Toaster position="top-right" />
      </AppProvider>
    </ClerkProvider>
  );
}

export default App;
