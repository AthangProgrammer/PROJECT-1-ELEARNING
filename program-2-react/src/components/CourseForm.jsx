import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * CourseForm Component
 * Manages course input fields, validation, and submission feedback.
 * Props:
 *  - onAddCourse: callback invoked when a valid course is submitted
 */
function CourseForm({ onAddCourse }) {
  const navigate = useNavigate();

  // Requirement 5: useState to manage form inputs
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: ''
  });

  // State for validation errors and submission feedback
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState(null);

  // Handle input change events
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear individual field error on change
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Requirement 10: Basic form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Course name is required.';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Course name must be at least 3 characters.';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Course description is required.';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters long.';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a course category.';
    }

    if (!formData.price) {
      newErrors.price = 'Course price is required.';
    } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a valid positive number.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Requirement 8: Form submission handling
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setFeedback({
        type: 'error',
        message: 'Please resolve the highlighted validation errors.'
      });
      return;
    }

    // Call parent handler passed via props
    onAddCourse({
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: formData.category,
      price: Number(formData.price)
    });

    // Requirement 7: Conditional feedback
    setFeedback({
      type: 'success',
      message: `Course "${formData.name.trim()}" successfully created!`
    });

    // Reset form fields
    setFormData({
      name: '',
      description: '',
      category: '',
      price: ''
    });
    setErrors({});
  };

  // Reset handler
  const handleReset = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      price: ''
    });
    setErrors({});
    setFeedback(null);
  };

  return (
    <div className="form-card">
      <div className="form-card-header">
        <h2>Enter New Course Details</h2>
        <p>Fill out the form below to publish a new course to the catalog.</p>
      </div>

      {/* Requirement 7: Form feedback alert */}
      {feedback && (
        <div className={`alert-box alert-${feedback.type}`}>
          <div className="alert-content">
            <span className="alert-icon">
              {feedback.type === 'success' ? '✅' : '⚠️'}
            </span>
            <span>{feedback.message}</span>
          </div>
          {feedback.type === 'success' && (
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={() => navigate('/')}
            >
              View Catalog →
            </button>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Field 1: Course Name */}
        <div className="form-group">
          <label htmlFor="course-name" className="form-label">
            Course Name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="course-name"
            name="name"
            className={`form-input ${errors.name ? 'input-error' : ''}`}
            placeholder="e.g., Full Stack Web Development"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        {/* Field 2: Description */}
        <div className="form-group">
          <label htmlFor="course-desc" className="form-label">
            Course Description <span className="required">*</span>
          </label>
          <textarea
            id="course-desc"
            name="description"
            rows="4"
            className={`form-textarea ${errors.description ? 'input-error' : ''}`}
            placeholder="Provide a comprehensive summary of what students will learn..."
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && (
            <span className="error-text">{errors.description}</span>
          )}
        </div>

        {/* 2-Column Row for Category and Price */}
        <div className="form-row">
          {/* Field 3: Category */}
          <div className="form-group col-half">
            <label htmlFor="course-cat" className="form-label">
              Category <span className="required">*</span>
            </label>
            <select
              id="course-cat"
              name="category"
              className={`form-select ${errors.category ? 'input-error' : ''}`}
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">-- Select Category --</option>
              <option value="Web Development">Web Development</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Data Science">Data Science</option>
              <option value="Design">Design</option>
              <option value="Business">Business</option>
            </select>
            {errors.category && (
              <span className="error-text">{errors.category}</span>
            )}
          </div>

          {/* Field 4: Price */}
          <div className="form-group col-half">
            <label htmlFor="course-price" className="form-label">
              Price (INR ₹) <span className="required">*</span>
            </label>
            <input
              type="number"
              id="course-price"
              name="price"
              min="0"
              step="1"
              className={`form-input ${errors.price ? 'input-error' : ''}`}
              placeholder="e.g., 2999"
              value={formData.price}
              onChange={handleChange}
            />
            {errors.price && <span className="error-text">{errors.price}</span>}
          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Publish Course
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
          >
            Reset Form
          </button>
        </div>
      </form>
    </div>
  );
}

export default CourseForm;
