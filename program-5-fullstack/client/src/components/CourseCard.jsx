const BADGES = {
  'Web Development': 'badge-web',
  'Computer Science': 'badge-cs',
  'Data Science': 'badge-data',
  Design: 'badge-design',
};

// Props: course, isEnrolled, canDelete, onEnroll(courseId), onDelete(courseId)
export default function CourseCard({ course, isEnrolled, canDelete, onEnroll, onDelete }) {
  return (
    <div className="course-card">
      <div className="course-card-header">
        <span className={`category-badge ${BADGES[course.category] || 'badge-default'}`}>{course.category}</span>
        <span className="course-price">₹{Number(course.price).toLocaleString('en-IN')}</span>
      </div>

      <h3 className="course-title">{course.name}</h3>
      <p className="course-description">{course.description}</p>

      <div className="course-card-footer">
        {isEnrolled ? (
          <span className="enrolled-status">✓ Enrolled</span>
        ) : (
          <button type="button" className="btn btn-primary" onClick={() => onEnroll(course._id)}>
            Enroll Now
          </button>
        )}
        {canDelete && (
          <button type="button" className="btn btn-outline-danger" onClick={() => onDelete(course._id)}>
            🗑 Delete
          </button>
        )}
      </div>
    </div>
  );
}
