import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * Navbar Component
 * Reusable navigation header with route links and active link highlighting.
 * Props:
 *  - totalCourses: number of courses currently in state
 */
function Navbar({ totalCourses = 0 }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-brand">
          <span className="brand-icon">🎓</span>
          <span className="brand-text">EduPortal</span>
          <span className="brand-tag">React Edition</span>
        </NavLink>

        <div className="navbar-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Course Catalog
            <span className="counter-badge">{totalCourses}</span>
          </NavLink>

          <NavLink
            to="/add-course"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            + Add New Course
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
