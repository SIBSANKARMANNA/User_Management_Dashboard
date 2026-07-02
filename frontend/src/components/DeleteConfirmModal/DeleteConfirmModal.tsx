import  { useState, useEffect } from 'react';
import Modal from 'react-modal';
import type { User } from '../../types/user';
import './DeleteConfirmModal.css';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  /**
   * The user targeted for deletion. When null, the modal renders nothing —
   * this lets the parent simply track "which user is pending delete" as
   * a single piece of state (null = no modal) rather than juggling two
   * separate isOpen/user values that could get out of sync.
   */
  user: User | null;
  onRequestClose: () => void;
  /**
   * Returns a boolean (matching useUsers' removeUser signature) so this
   * modal knows whether to close (true) or stay open and show an error
   * so the user can retry (false).
   */
  onConfirm: () => Promise<boolean>;
}

const modalStyles: Modal.Styles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '380px',
    borderRadius: '8px',
    padding: '1.5rem',
  },
};

/**
 * Simple confirm/cancel dialog shown before a user is deleted.
 * Deliberately does not use shouldCloseOnOverlayClick={false} — an
 * accidental overlay click just cancels the delete, which is the
 * safer default (no destructive action happens without an explicit click).
 */
function DeleteConfirmModal({ isOpen, user, onRequestClose, onConfirm }: DeleteConfirmModalProps) {
  const [deleting, setDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Clear any stale error from a previous attempt each time the modal opens.
  useEffect(() => {
    if (isOpen) {
      setError(null);
    }
  }, [isOpen]);

  if (!user) {
    return null;
  }

  const handleConfirm = async () => {
    setDeleting(true);
    setError(null);

    const success = await onConfirm();

    setDeleting(false);

    if (success) {
      onRequestClose();
    } else {
      setError('Could not delete this user. Please try again.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={modalStyles}
      contentLabel="Confirm Delete"
      ariaHideApp={process.env.NODE_ENV !== 'test'}
    >
      <h2 className="delete-confirm-title">Delete User</h2>
      <p className="delete-confirm-message">
        Are you sure you want to delete <strong>{user.firstName} {user.lastName}</strong>? This action cannot be undone.
      </p>

      {error && <p className="delete-confirm-error" role="alert">{error}</p>}

      <div className="delete-confirm-actions">
        <button type="button" className="btn btn-cancel" onClick={onRequestClose} disabled={deleting}>
          Cancel
        </button>
        <button type="button" className="btn btn-confirm-delete" onClick={handleConfirm} disabled={deleting}>
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </Modal>
  );
}

export default DeleteConfirmModal;