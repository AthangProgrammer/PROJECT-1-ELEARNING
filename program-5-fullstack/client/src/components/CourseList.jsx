import { useState } from 'react';
import CourseCard from './CourseCard';

export const CATEGORIES = ['Web Development', 'Computer Science', 'Data Science', 'Design', 'Business'];

// Shows the search box + category filter and the grid of cards
export default function CourseList({ courses, enrolledIds, userId, onEnroll, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = courses.filter((c) => {
    const text = searchTerm.toLowerCase();
    const matchesSearch = c.name.toLowerCase().includes(text) || c.description.toLowerCase().includes(text);
    return matchesSearch && (category === 'All' || c.category === category);
  });

  return (
    <div className="course-list-wrapper">
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
          <select id="category-select" className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3>No Courses Found</h3>
          <p>The catalog is empty. Log in and add the first course!</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No Matching Courses</h3>
          <p>Try a different search term or category.</p>
        </div>
      ) : (
        <div className="course-grid">
          {filtered.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              isEnrolled={enrolledIds.includes(course._id)}
              canDelete={Boolean(userId) && course.createdBy === userId}
              onEnroll={onEnroll}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
