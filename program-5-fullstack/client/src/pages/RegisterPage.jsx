import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';
import { api } from '../api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Name is required.');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError('Enter a valid email.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');

    setLoading(true);
    setError('');
    try {
      await api('/auth/register', { method: 'POST', body: form });
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container page-narrow">
      <div className="form-card">
        <div className="form-card-header"><h2>Create an account</h2></div>
        <Alert type="error" message={error} />
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Name</label>
            <input id="name" name="name" className="form-input" value={form.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input id="email" name="email" type="email" className="form-input" value={form.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password (min 6 characters)</label>
            <input id="password" name="password" type="password" className="form-input" value={form.password} onChange={handleChange} />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
          </div>
        </form>
        <p>Already have an account? <Link to="/login">Log in</Link></p>
      </div>
    </div>
  );
}
