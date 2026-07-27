import { Link } from "react-router-dom";

export default function LoginRequiredModal({ onClose, message }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h2>Login Required</h2>
          </div>

          <p>{message}</p>

          <div className="modal-actions">
            <Link className="btn btn-primary navbar-theme-color" to="/login" onClick={onClose}>
              Login
            </Link>
            <button className="btn btn-secondary" type="button" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
