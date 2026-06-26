import React, { createContext, useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [API_BASE] = useState(() => {
    const envBase = import.meta.env.VITE_API_BASE;
    if (envBase && envBase.trim() !== '') {
      return envBase.trim();
    }
    // Dynamic fallback to local IP for sharing across devices on same network
    return `http://${window.location.hostname}:5000`;
  });

  // Authentication & Token State
  const [token, setToken] = useState(() => localStorage.getItem('digi_token') || null);
  const [currentUser, setCurrentUser] = useState(null);
  const [syncError, setSyncError] = useState(null);
  
  // Portal View routing
  const [portal, setPortal] = useState(() => localStorage.getItem('digi_portal') || 'landing');

  // Clerk authentication state hooks
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  const { getToken, signOut: clerkSignOut } = useAuth();

  // Sync Clerk authenticated user with backend
  const syncClerkUser = async () => {
    if (!isSignedIn || !clerkUser) return;
    setSyncError(null);
    try {
      const clerkToken = await getToken();
      console.log('Syncing Clerk user: fetching backend API base', API_BASE);
      const res = await fetch(`${API_BASE}/api/auth/clerk-sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${clerkToken}`
        },
        body: JSON.stringify({
          clerkId: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress,
          name: clerkUser.fullName || clerkUser.username || 'Clerk User',
          avatar: clerkUser.imageUrl
        })
      });
      const data = await res.json();
      if (res.ok) {
        console.log('Backend sync successful. User:', data.user);
        setToken(data.token);
        setCurrentUser(data.user);
        setPortal(data.user.role === 'admin' ? 'admin' : data.user.role);
      } else {
        console.error('Clerk sync failed backend response:', data.error);
        setSyncError(data.error || 'Your account is not registered. Please contact the administrator.');
        alert(data.error || 'Your account is not registered. Please contact the administrator.');
        clerkSignOut();
      }
    } catch (err) {
      console.error('Error syncing Clerk user:', err.message);
      setSyncError(`Network error: ${err.message}`);
    }
  };

  // Effect to sync Clerk user when signed in/out
  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        syncClerkUser();
      } else {
        if (currentUser && currentUser.clerkId) {
          logout();
        }
      }
    }
  }, [isLoaded, isSignedIn, clerkUser]);

  // App Datasets
  const [courses, setCourses] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [studentProgress, setStudentProgress] = useState({});
  const [mockStudents, setMockStudents] = useState([]);

  // Fetch helper with Authorization header
  const fetchWithAuth = async (endpoint, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Server request failed');
    }
    return response.json();
  };

  // Activity Logging function
  const logActivity = async (type, message, customUser = null) => {
    try {
      const userIdent = customUser 
        ? `${customUser.email} (${customUser.role})` 
        : currentUser 
        ? `${currentUser.email} (${currentUser.role})` 
        : 'Anonymous';
      
      await fetch(`${API_BASE}/api/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          message,
          user: userIdent
        })
      });
    } catch (err) {
      console.error('Failed to send activity log to server:', err.message);
    }
  };

  // Sync portal view changes to localStorage & Log page views
  useEffect(() => {
    localStorage.setItem('digi_portal', portal);
    logActivity('ROUTE', `Navigated to portal view: "${portal}"`);
  }, [portal]);

  // Sync token changes to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('digi_token', token);
    } else {
      localStorage.removeItem('digi_token');
    }
  }, [token]);

  // Load public data on mount
  const loadPublicData = async () => {
    try {
      const [coursesList, blogsList, timetableList] = await Promise.all([
        fetch(`${API_BASE}/api/courses`).then(r => r.json()),
        fetch(`${API_BASE}/api/blogs`).then(r => r.json()),
        fetch(`${API_BASE}/api/timetable`).then(r => r.json()),
      ]);
      setCourses(coursesList);
      setBlogs(blogsList);
      setTimetable(timetableList);
    } catch (err) {
      console.error('Error loading public data:', err.message);
    }
  };

  useEffect(() => {
    loadPublicData();
  }, []);

  // Fetch current user session if token exists
  useEffect(() => {
    const fetchSession = async () => {
      if (!token) {
        setCurrentUser(null);
        return;
      }
      try {
        const user = await fetchWithAuth('/api/auth/me');
        setCurrentUser(user);
      } catch (err) {
        console.error('Session expired or invalid:', err.message);
        setToken(null);
        setCurrentUser(null);
        setPortal('landing');
      }
    };
    fetchSession();
  }, [token]);

  // Fetch role-specific datasets once user logs in
  const loadRoleSpecificData = async () => {
    if (!currentUser) return;
    try {
      if (currentUser.role === 'student') {
        const progress = await fetchWithAuth('/api/courses/progress');
        // progress maps courseId -> progress info. Store in studentProgress[currentUser.id]
        setStudentProgress(prev => ({
          ...prev,
          [currentUser.id]: progress
        }));
      } else if (currentUser.role === 'teacher' || currentUser.role === 'admin') {
        const [allProgress, studentsList] = await Promise.all([
          fetchWithAuth('/api/courses/progress/all'),
          fetchWithAuth('/api/users/students')
        ]);
        setStudentProgress(allProgress);
        setMockStudents(studentsList);
      }
    } catch (err) {
      console.error('Error loading user-specific data:', err.message);
    }
  };

  useEffect(() => {
    loadRoleSpecificData();
  }, [currentUser]);

  // Authentication - Login
  const login = async (email, password) => {
    try {
      const data = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const res = await data.json();
      if (!data.ok) {
        logActivity('AUTH_FAILURE', `Failed login attempt for email: "${email}"`, { email, role: 'unknown' });
        throw new Error(res.error || 'Login credentials incorrect');
      }
      
      setToken(res.token);
      setCurrentUser(res.user);
      setPortal(res.user.role === 'admin' ? 'admin' : res.user.role);
      logActivity('AUTH_SUCCESS', `User logged in successfully`, res.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // Authentication - Registration (Sign Up)
  const register = async (name, email, password, role) => {
    try {
      const data = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      const res = await data.json();
      if (!data.ok) {
        logActivity('AUTH_FAILURE', `Failed registration attempt for email: "${email}"`, { email, role });
        throw new Error(res.error || 'Registration failed');
      }

      setToken(res.token);
      setCurrentUser(res.user);
      setPortal(res.user.role);
      logActivity('AUTH_SUCCESS', `New user registered and logged in`, res.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // Authentication - Logout
  function logout() {
    logActivity('AUTH_LOGOUT', `User logged out`);
    setToken(null);
    setCurrentUser(null);
    setPortal('landing');
    localStorage.removeItem('digi_token');
    localStorage.setItem('digi_portal', 'landing');
    if (isSignedIn) {
      clerkSignOut();
    }
  }

  // Profile - Update Details
  const updateProfile = async (name, avatar) => {
    try {
      await fetchWithAuth('/api/profile/update', {
        method: 'POST',
        body: JSON.stringify({ name, avatar })
      });
      logActivity('PROFILE_UPDATE', `Updated display name to: "${name}" and avatar to: "${avatar}"`);
      setCurrentUser(prev => prev ? { ...prev, name, avatar } : null);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // Profile - Update Password
  const updatePassword = async (oldPassword, newPassword) => {
    try {
      await fetchWithAuth('/api/profile/update-password', {
        method: 'POST',
        body: JSON.stringify({ oldPassword, newPassword })
      });
      logActivity('PROFILE_UPDATE', `Changed user password`);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // Courses - Add Course (Teacher/Admin)
  const addCourse = async (courseData) => {
    try {
      await fetchWithAuth('/api/courses', {
        method: 'POST',
        body: JSON.stringify(courseData)
      });
      logActivity('COURSE_CREATE', `Created a new course: "${courseData.title}"`);
      const coursesList = await fetch(`${API_BASE}/api/courses`).then(r => r.json());
      setCourses(coursesList);
    } catch (err) {
      console.error('Error adding course:', err.message);
    }
  };

  // Courses - Delete Course (Admin)
  const deleteCourse = async (courseId) => {
    try {
      const deletedCourse = courses.find(c => c.id === courseId);
      await fetchWithAuth(`/api/courses/${courseId}`, {
        method: 'DELETE'
      });
      logActivity('COURSE_DELETE', `Deleted course ID: ${courseId} ("${deletedCourse?.title || 'Unknown'}")`);
      const coursesList = await fetch(`${API_BASE}/api/courses`).then(r => r.json());
      setCourses(coursesList);
    } catch (err) {
      console.error('Error deleting course:', err.message);
    }
  };

  // Progress - Grade student card (Teacher/Admin)
  const updateStudentProgress = async (studentId, courseId, percent, grade, remarks) => {
    try {
      await fetchWithAuth('/api/courses/progress', {
        method: 'POST',
        body: JSON.stringify({ studentId, courseId, percent, grade, remarks })
      });
      const student = mockStudents.find(s => s.id === studentId);
      const course = courses.find(c => c.id === courseId);
      logActivity('PROGRESS_UPDATE', `Graded student "${student?.name || studentId}" for course "${course?.title || courseId}": ${percent}% complete, Grade: "${grade}", Remarks: "${remarks}"`);
      const allProgress = await fetchWithAuth('/api/courses/progress/all');
      setStudentProgress(allProgress);
    } catch (err) {
      console.error('Error updating student progress:', err.message);
    }
  };

  // Progress - Complete single module (Student self progress increase)
  const toggleModuleComplete = async (studentId, courseId, moduleId) => {
    try {
      const progressUpdate = await fetchWithAuth('/api/courses/module-complete', {
        method: 'POST',
        body: JSON.stringify({ courseId, moduleId })
      });
      
      const course = courses.find(c => c.id === courseId);
      const mod = course?.modules?.find(m => m.id === moduleId);
      logActivity('PROGRESS_COMPLETE', `Completed module: "${mod?.title || moduleId}" in course "${course?.title || courseId}". New progress: ${progressUpdate.percent}%`);
      
      // Update local state directly
      setStudentProgress(prev => {
        const studentMap = prev[studentId] || {};
        return {
          ...prev,
          [studentId]: {
            ...studentMap,
            [courseId]: progressUpdate
          }
        };
      });
    } catch (err) {
      console.error('Error ticking module:', err.message);
    }
  };

  // Enroll student in a course
  const enrollInCourse = async (courseId) => {
    try {
      await fetchWithAuth('/api/courses/enroll', {
        method: 'POST',
        body: JSON.stringify({ courseId })
      });
      const course = courses.find(c => c.id === courseId);
      logActivity('COURSE_ENROLL', `Enrolled in course: "${course?.title || courseId}"`);
      loadRoleSpecificData();
    } catch (err) {
      console.error('Enrollment error:', err.message);
    }
  };

  // Blogs - Publish post (Teacher/Admin)
  const addBlogPost = async (blogData) => {
    try {
      await fetchWithAuth('/api/blogs', {
        method: 'POST',
        body: JSON.stringify(blogData)
      });
      logActivity('BLOG_PUBLISH', `Published new blog post: "${blogData.title}"`);
      const blogsList = await fetch(`${API_BASE}/api/blogs`).then(r => r.json());
      setBlogs(blogsList);
    } catch (err) {
      console.error('Error adding blog post:', err.message);
    }
  };

  // Blogs - Delete post (Teacher/Admin)
  const deleteBlogPost = async (blogId) => {
    try {
      const deletedBlog = blogs.find(b => b.id === blogId);
      await fetchWithAuth(`/api/blogs/${blogId}`, {
        method: 'DELETE'
      });
      logActivity('BLOG_DELETE', `Deleted blog post ID: ${blogId} ("${deletedBlog?.title || 'Unknown'}")`);
      const blogsList = await fetch(`${API_BASE}/api/blogs`).then(r => r.json());
      setBlogs(blogsList);
    } catch (err) {
      console.error('Error deleting blog post:', err.message);
    }
  };

  // Timetable - Schedule Live Class (Teacher/Admin)
  const addTimetableSlot = async (slotData) => {
    try {
      await fetchWithAuth('/api/timetable', {
        method: 'POST',
        body: JSON.stringify(slotData)
      });
      const course = courses.find(c => c.id === slotData.courseId);
      logActivity('TIMETABLE_CREATE', `Scheduled live class for course: "${course?.title || slotData.courseId}" on topic: "${slotData.topic}"`);
      const timetableList = await fetch(`${API_BASE}/api/timetable`).then(r => r.json());
      setTimetable(timetableList);
    } catch (err) {
      console.error('Error scheduling timetable class:', err.message);
    }
  };

  return (
    <AppContext.Provider value={{
      API_BASE,
      token,
      portal,
      setPortal,
      currentUser,
      setCurrentUser,
      syncError,
      syncClerkUser,
      courses,
      blogs,
      timetable,
      studentProgress,
      mockStudents,
      login,
      register,
      logout,
      updateProfile,
      updatePassword,
      addCourse,
      deleteCourse,
      enrollInCourse,
      updateStudentProgress,
      toggleModuleComplete,
      addBlogPost,
      deleteBlogPost,
      addTimetableSlot,
      fetchWithAuth,
      logActivity
    }}>
      {children}
    </AppContext.Provider>
  );
};
