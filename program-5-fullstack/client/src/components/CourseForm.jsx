import { useState } from 'react';
import { CATEGORIES } from './CourseList';

const empty = { name: '', description: '', category: '', price: '' };

// Props: onSubmit(courseData) -> async, throws Error on failure
export default function CourseForm({ onSubmit }) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState(null); // { type, message }
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 3) e.name = 'Course name must be at least 3 characters.';
    if (form.description.trim().length < 10) e.description = 'Description must be at least 10 characters.';
    if (!form.category) e.category = 'Please select a category.';
    if (form.price === '' || isNaN(form.price) || Number(form.price) < 0) e.price = 'Price must be a number, 0 or more.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return setFeedback({ type: 'error', message: 'Please fix the highlighted fields.' });

    setSaving(true);
    try {
      await onSubmit({
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        price: Number(form.price),
      });
      setFeedback({ type: 'success', message: `Course "${form.name.trim()}" created!` });
      setForm(empty);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const alert = feedback && (
    <div className={`alert-box alert-${feedback.type}`}>
      <div className="alert-content">
        <span className="alert-icon">{feedback.type === 'success' ? '✅' : '⚠️'}</span>
        <span>{feedback.message}</span>
      </div>
    </div>
  );

  return (
    <div className="form-card">
      <div className="form-card-header">
        <h2>Enter New Course Details</h2>
        <p>The course is saved in MongoDB and appears in the catalog.</p>
      </div>
      {alert}
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="name" className="form-label">Course Name <span className="required">*</span></label>
          <input id="name" name="name" className={`form-input ${errors.name ? 'input-error' : ''}`} value={form.name} onChange={handleChange} />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">Description <span className="required">*</span></label>
          <textarea id="description" name="description" rows="4" className={`form-textarea ${errors.description ? 'input-error' : ''}`} value={form.description} onChange={handleChange} />
          {errors.description && <span className="error-text">{errors.description}</span>}
        </div>

        <div className="form-row">
          <div className="form-group col-half">
            <label htmlFor="category" className="form-label">Category <span className="required">*</span></label>
            <select id="category" name="category" className={`form-select ${errors.category ? 'input-error' : ''}`} value={form.category} onChange={handleChange}>
              <option value="">-- Select Category --</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <span className="error-text">{errors.category}</span>}
          </div>
          <div className="form-group col-half">
            <label htmlFor="price" className="form-label">Price (INR ₹) <span className="required">*</span></label>
            <input id="price" name="price" type="number" min="0" className={`form-input ${errors.price ? 'input-error' : ''}`} value={form.price} onChange={handleChange} />
            {errors.price && <span className="error-text">{errors.price}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Publish Course'}</button>
        </div>
      </form>
    </div>
  );
}
