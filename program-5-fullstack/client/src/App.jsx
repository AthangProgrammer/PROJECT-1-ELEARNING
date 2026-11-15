import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import CoursesPage from './pages/CoursesPage';
import AddCoursePage from './pages/AddCoursePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EnrollmentsPage from './pages/EnrollmentsPage';
import { useAuth } from './AuthContext';

// Only logged-in users can open these pages
function Protected({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<CoursesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/add-course" element={<Protected><AddCoursePage /></Protected>} />
          <Route path="/my-enrollments" element={<Protected><EnrollmentsPage /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="footer">
        <div className="footer-content">
          <p>© 2026 EduPortal E-Learning Platform • Program 5 (Full Stack)</p>
        </div>
      </footer>
    </div>
  );
}
