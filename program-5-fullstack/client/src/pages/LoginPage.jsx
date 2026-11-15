import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Alert from '../components/Alert';
import { api } from '../api';
import { useAuth } from '../AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password) return setError('Email and password are required.');

    setLoading(true);
    setError('');
    try {
      const data = await api('/auth/login', { method: 'POST', body: form });
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container page-narrow">
      <div className="form-card">
        <div className="form-card-header"><h2>Log in</h2></div>
        {location.state?.registered && <Alert type="success" message="Registration successful. Please log in." />}
        <Alert type="error" message={error} />
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input id="email" name="email" type="email" className="form-input" value={form.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input id="password" name="password" type="password" className="form-input" value={form.password} onChange={handleChange} />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Logging in...' : 'Log in'}</button>
          </div>
        </form>
        <p>No account yet? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
}
