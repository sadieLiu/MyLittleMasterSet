import React from "react";
import '../styles/components.css';
import { useAuth } from "../hooks/useAuth.jsx";

export default function CardModal({
  open,
  onClose,
  image,
  title,
  description,
  action
}) {
  const {currentUser} = useAuth();
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        
        {/* Left side: card image */}
        <div className="modal-image">
          <img src={image} alt={title} />
        </div>

        {/* Right side: text + buttons */}
        <div className="modal-content">
          <div className="modal-header">
            <h2>{title}</h2>

            {currentUser && action && (
              <div className="modal-actions">
                {action}
              </div>
            )}

            {!currentUser && (
              <div className="modal-actions">
                <p className="text-muted">
                  Please sign in to add favorites.
                </p>
              </div>
            )}
          </div>

          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}


