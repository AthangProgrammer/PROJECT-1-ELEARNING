import React, { useState } from 'react';
import CourseCard from './CourseCard';

/**
 * CourseList Component
 * Renders the collection of courses or an empty list placeholder.
 * Props:
 *  - courses: array of course objects
 *  - onDeleteCourse: callback function to delete a course
 */
function CourseList({ courses = [], onDeleteCourse }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter courses based on search term and category
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="course-list-wrapper">
      {/* Search and Category Filter Toolbar */}
      <div className="filter-toolbar">
        <div className="search-box">
          <input
            type="text"
            className="form-input search-input"
            placeholder="🔍 Search courses by name or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-filter">
          <label htmlFor="category-select" className="filter-label">Filter:</label>
          <select
            id="category-select"
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Web Development">Web Development</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Data Science">Data Science</option>
            <option value="Design">Design</option>
            <option value="Business">Business</option>
          </select>
        </div>
      </div>

      {/* Requirement 7: Conditional rendering for empty list */}
      {courses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3>No Courses Found</h3>
          <p>The course catalog is currently empty. Use the course entry form to add your first course!</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No Matching Courses</h3>
          <p>No courses match your search or filter criteria. Try adjusting your search term.</p>
        </div>
      ) : (
        <div className="course-grid">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onDeleteCourse={onDeleteCourse}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CourseList;
