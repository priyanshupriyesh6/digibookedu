import React, { useContext } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StatsCounter from './components/StatsCounter';
import FeaturedCourses from './components/FeaturedCourses';
import Categories from './components/Categories';
import WhyChooseUs from './components/WhyChooseUs';
import Testimonials from './components/Testimonials';
import CTABanner from './components/CTABanner';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import StudentPortal from './components/StudentPortal';
import TeacherPortal from './components/TeacherPortal';
import AdminPortal from './components/AdminPortal';
import BlogsPage from './components/BlogsPage';
import './index.css';

function AppContent() {
  const { portal } = useContext(AppContext);

  if (portal === 'student') {
    return <StudentPortal />;
  }

  if (portal === 'teacher') {
    return <TeacherPortal />;
  }

  if (portal === 'admin') {
    return <AdminPortal />;
  }

  if (portal === 'blogs') {
    return (
      <div className="min-h-screen flex flex-col bg-surface text-white">
        <Navbar />
        <main className="flex-1">
          <BlogsPage />
        </main>
        <Footer />
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
        <WhyChooseUs />
        <Testimonials />
        <CTABanner />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
