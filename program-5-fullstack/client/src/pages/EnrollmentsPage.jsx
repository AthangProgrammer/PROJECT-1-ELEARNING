import { useState, useEffect } from 'react';
import Alert from '../components/Alert';
import { api } from '../api';
import { useAuth } from '../AuthContext';

export default function EnrollmentsPage() {
  const { token } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/enrollments', { token })
      .then(setEnrollments)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="page-container">
      <header className="page-header">
        <h1 className="page-title">My Enrollments</h1>
      </header>
      {loading && <p className="empty-state">Loading...</p>}
      <Alert type="error" message={error} />
      {!loading && !error && enrollments.length === 0 && (
        <div className="empty-state"><h3>You have not enrolled in any course yet.</h3></div>
      )}
      <div className="course-grid">
        {enrollments.filter((e) => e.course).map((e) => (
          <div className="course-card" key={e._id}>
            <h3 className="course-title">{e.course.name}</h3>
            <p className="course-description">{e.course.description}</p>
            <div className="course-card-footer">
              <span className="enrolled-status">✓ Enrolled on {new Date(e.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
