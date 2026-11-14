import React from 'react';
import { Link } from 'react-router-dom';
import CourseList from '../components/CourseList';

/**
 * CoursesPage Component
 * Top-level page for listing and searching available courses.
 * Props:
 *  - courses: array of courses from App state
 *  - onDeleteCourse: callback to delete a course
 */
function CoursesPage({ courses, onDeleteCourse }) {
  // Compute some simple stats for the UI
  const totalCourses = courses.length;
  const uniqueCategories = new Set(courses.map((c) => c.category)).size;

  return (
    <div className="page-container">
      {/* Hero Banner Section */}
      <header className="page-header">
        <div className="header-info">
          <h1 className="page-title">Explore Courses</h1>
          <p className="page-subtitle">
            Browse our catalog of professional courses designed to boost your engineering and development skills.
          </p>
        </div>

        <div className="header-actions">
          <div className="stats-badges">
            <span className="stat-pill">
              <strong>{totalCourses}</strong> Courses Total
            </span>
            <span className="stat-pill">
              <strong>{uniqueCategories}</strong> Categories
            </span>
          </div>

          <Link to="/add-course" className="btn btn-primary add-course-btn">
            + Add New Course
          </Link>
        </div>
      </header>

      {/* Course List Component (Props passing) */}
      <CourseList courses={courses} onDeleteCourse={onDeleteCourse} />
    </div>
  );
}

export default CoursesPage;
