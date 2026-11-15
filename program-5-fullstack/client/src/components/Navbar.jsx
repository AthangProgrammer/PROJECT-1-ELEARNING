import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const linkClass = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link');

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-brand">
          <span className="brand-icon">🎓</span>
          <span className="brand-text">EduPortal</span>
          <span className="brand-tag">Full Stack</span>
        </NavLink>

        <div className="navbar-links">
          <NavLink to="/" end className={linkClass}>Courses</NavLink>
          {user ? (
            <>
              <NavLink to="/add-course" className={linkClass}>+ Add Course</NavLink>
              <NavLink to="/my-enrollments" className={linkClass}>My Enrollments</NavLink>
              <span className="nav-user">Hi, {user.name}</span>
              <button type="button" className="btn btn-sm btn-outline" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>Login</NavLink>
              <NavLink to="/register" className={linkClass}>Register</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
