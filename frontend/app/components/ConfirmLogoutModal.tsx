import React from "react";

interface ConfirmLogoutModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmLogoutModal: React.FC<ConfirmLogoutModalProps> = ({ open, onClose, onConfirm }) => {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirm Logout</h2>
        <p>Are you sure you want to log out?</p>
        <div className="modal-actions">
          <button className="btn cancel" onClick={onClose}>Cancel</button>
          <button className="btn confirm" onClick={onConfirm}>Logout</button>
        </div>
      </div>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          background: #fff;
          border-radius: 8px;
          padding: 2rem;
          min-width: 320px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.15);
          text-align: center;
        }
        .modal-actions {
          margin-top: 1.5rem;
          display: flex;
          justify-content: space-between;
        }
        .btn {
          padding: 0.5rem 1.5rem;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
        }
        .btn.cancel {
          background: #eee;
          color: #333;
        }
        .btn.confirm {
          background: #e53935;
          color: #fff;
        }
        .btn.cancel:hover {
          background: #ddd;
        }
        .btn.confirm:hover {
          background: #b71c1c;
        }
      `}</style>
    </div>
  );
};

export default ConfirmLogoutModal; 