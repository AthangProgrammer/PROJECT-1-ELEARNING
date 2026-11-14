import React, { useState } from 'react';

/**
 * CourseCard Component
 * Reusable functional component to display an individual course item.
 * Props:
 *  - course: { id, name, description, category, price }
 *  - onDeleteCourse: callback function when student/admin removes a course
 */
function CourseCard({ course, onDeleteCourse }) {
  const [isEnrolled, setIsEnrolled] = useState(false);

  const handleEnrollClick = () => {
    setIsEnrolled(true);
  };

  // Category badge styling helper
  const getCategoryClass = (category) => {
    switch (category) {
      case 'Web Development':
        return 'badge-web';
      case 'Computer Science':
        return 'badge-cs';
      case 'Data Science':
        return 'badge-data';
      case 'Design':
        return 'badge-design';
      default:
        return 'badge-default';
    }
  };

  return (
    <div className="course-card">
      <div className="course-card-header">
        <span className={`category-badge ${getCategoryClass(course.category)}`}>
          {course.category}
        </span>
        <span className="course-price">₹{Number(course.price).toLocaleString('en-IN')}</span>
      </div>

      <h3 className="course-title">{course.name}</h3>
      <p className="course-description">{course.description}</p>

      <div className="course-card-footer">
        {/* Conditional rendering for enrollment state */}
        {isEnrolled ? (
          <span className="enrolled-status">✓ Enrolled</span>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleEnrollClick}
          >
            Enroll Now
          </button>
        )}

        {/* Delete action passing course ID to parent */}
        <button
          type="button"
          className="btn btn-outline-danger"
          title="Delete Course"
          onClick={() => onDeleteCourse(course.id)}
        >
          🗑 Delete
        </button>
      </div>
    </div>
  );
}

export default CourseCard;
