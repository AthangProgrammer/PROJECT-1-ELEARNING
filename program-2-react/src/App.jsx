import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import CoursesPage from './pages/CoursesPage';
import AddCoursePage from './pages/AddCoursePage';
import { initialCourses } from './data/initialCourses';

/**
 * Main App Component
 * Manages core state, persistence via useEffect, and routing.
 */
function App() {
  // Requirement 5: useState to manage course collection
  const [courses, setCourses] = useState(() => {
    try {
      const saved = localStorage.getItem('elearning_react_courses');
      return saved ? JSON.parse(saved) : initialCourses;
    } catch (error) {
      console.warn('Could not load courses from localStorage, using initial seed data.', error);
      return initialCourses;
    }
  });

  // Requirement 6: useEffect to synchronize courses with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('elearning_react_courses', JSON.stringify(courses));
    } catch (error) {
      console.error('Could not save courses to localStorage.', error);
    }
  }, [courses]);

  // Requirement 6: useEffect to update dynamic document title
  useEffect(() => {
    document.title = `EduPortal - ${courses.length} Courses Available`;
  }, [courses]);

  // Handler to add a newly created course
  const handleAddCourse = (newCourseData) => {
    const newCourse = {
      id: Date.now(), // Generate unique ID
      ...newCourseData
    };
    setCourses((prevCourses) => [newCourse, ...prevCourses]);
  };

  // Handler to delete a course by ID
  const handleDeleteCourse = (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this course?');
    if (confirmed) {
      setCourses((prevCourses) => prevCourses.filter((course) => course.id !== id));
    }
  };

  return (
    <BrowserRouter>
      <div className="app-layout">
        {/* Navigation Bar receiving total count as props */}
        <Navbar totalCourses={courses.length} />

        {/* Main Content Area with React Router */}
        <main className="main-content">
          <Routes>
            {/* Route 1: Course Listing View */}
            <Route
              path="/"
              element={
                <CoursesPage
                  courses={courses}
                  onDeleteCourse={handleDeleteCourse}
                />
              }
            />

            {/* Route 2: Course Entry Form */}
            <Route
              path="/add-course"
              element={<AddCoursePage onAddCourse={handleAddCourse} />}
            />

            {/* Fallback route redirecting to catalog */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Simple Educational Footer */}
        <footer className="footer">
          <div className="footer-content">
            <p>© 2026 EduPortal E-Learning Platform • Program 2 (React Application)</p>
            <p className="footer-note">Designed for Web Development Coursework</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
