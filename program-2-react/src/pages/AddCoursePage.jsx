import React from 'react';
import { Link } from 'react-router-dom';
import CourseForm from '../components/CourseForm';

/**
 * AddCoursePage Component
 * Route page dedicated to submitting a new course entry.
 * Props:
 *  - onAddCourse: callback to save a newly created course
 */
function AddCoursePage({ onAddCourse }) {
  return (
    <div className="page-container page-narrow">
      <div className="page-nav-back">
        <Link to="/" className="back-link">
          ← Back to Catalog
        </Link>
      </div>

      <header className="page-header text-center">
        <h1 className="page-title">Course Entry Form</h1>
        <p className="page-subtitle">
          Submit a new course entry with comprehensive details, category, and pricing.
        </p>
      </header>

      {/* Course Form Component */}
      <CourseForm onAddCourse={onAddCourse} />
    </div>
  );
}

export default AddCoursePage;
