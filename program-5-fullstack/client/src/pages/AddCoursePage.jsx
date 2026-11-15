import { Link } from 'react-router-dom';
import CourseForm from '../components/CourseForm';
import { api } from '../api';
import { useAuth } from '../AuthContext';

export default function AddCoursePage() {
  const { token } = useAuth();

  return (
    <div className="page-container page-narrow">
      <div className="page-nav-back">
        <Link to="/" className="back-link">← Back to Catalog</Link>
      </div>
      <header className="page-header text-center">
        <h1 className="page-title">Course Entry Form</h1>
      </header>
      <CourseForm onSubmit={(course) => api('/courses', { method: 'POST', body: course, token })} />
    </div>
  );
}
