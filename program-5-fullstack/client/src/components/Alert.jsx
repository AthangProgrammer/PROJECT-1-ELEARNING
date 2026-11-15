// Success / error message box. Renders nothing when there is no message.
export default function Alert({ type, message }) {
  if (!message) return null;
  return (
    <div className={`alert-box alert-${type}`}>
      <div className="alert-content">
        <span className="alert-icon">{type === 'success' ? '✅' : '⚠️'}</span>
        <span>{message}</span>
      </div>
    </div>
  );
}
