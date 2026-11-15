import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseList from '../components/CourseList';
import Alert from '../components/Alert';
import { api } from '../api';
import { useAuth } from '../AuthContext';

export default function CoursesPage() {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(null); // { type, text }

  // Load courses (and the user's enrollments, if logged in) when the page opens
  useEffect(() => {
    async function load() {
      try {
        setCourses(await api('/courses'));
        if (token) {
          const enrollments = await api('/enrollments', { token });
          setEnrolledIds(enrollments.filter((e) => e.course).map((e) => e.course._id));
        } else {
          setEnrolledIds([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  const handleEnroll = async (courseId) => {
    if (!token) return navigate('/login');
    try {
      const enrollment = await api('/enrollments', { method: 'POST', body: { courseId }, token });
      setEnrolledIds((ids) => [...ids, courseId]);
      setMessage({ type: 'success', text: `Enrollment confirmed: ${enrollment.course.name}` });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await api(`/courses/${courseId}`, { method: 'DELETE', token });
      setCourses((list) => list.filter((c) => c._id !== courseId));
      setMessage({ type: 'success', text: 'Course deleted.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div className="header-info">
          <h1 className="page-title">Explore Courses</h1>
          <p className="page-subtitle">Courses are loaded live from MongoDB through the Express API.</p>
        </div>
      </header>

      <Alert type={message?.type} message={message?.text} />

      {loading && <p className="empty-state">Loading courses...</p>}
      {error && <Alert type="error" message={error} />}
      {!loading && !error && (
        <CourseList
          courses={courses}
          enrolledIds={enrolledIds}
          userId={user?.id}
          onEnroll={handleEnroll}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
