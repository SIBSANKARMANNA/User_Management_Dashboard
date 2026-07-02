import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import  type { UserFormData } from '../../types/user';
import type { FormErrors } from '../../utils/validators';
import  { validateUserForm } from '../../utils/validators';
import './UserFormModal.css';

interface UserFormModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  /**
   * Called with the validated form data on submit. Returns a boolean
   * (matching useUsers' addUser/editUser signature) so this modal knows
   * whether to close itself (true) or stay open with the data intact
   * so the user can retry (false).
   */
  onSubmit: (formData: UserFormData) => Promise<boolean>;
  /**
   * When provided, the modal opens in "Edit" mode pre-filled with this
   * data. When undefined, it opens in "Add" mode with empty fields.
   * The same modal serves both flows to avoid duplicating form markup (DRY).
   */
  initialData?: UserFormData;
}

const EMPTY_FORM: UserFormData = { firstName: '', lastName: '', email: '', department: '' };

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
    maxWidth: '420px',
    borderRadius: '8px',
    padding: '1.5rem',
  },
};

/**
 * Add/Edit user form rendered in a react-modal dialog.
 * Mode (Add vs Edit) is decided entirely by whether `initialData` is passed —
 * one component instead of two nearly-identical ones.
 */
function UserFormModal({ isOpen, onRequestClose, onSubmit, initialData }: UserFormModalProps) {
  const isEditMode = initialData !== undefined;

  const [formData, setFormData] = useState<UserFormData>(initialData ?? EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Reset the form to fresh state every time the modal opens, so a
  // previous Add doesn't leak into the next Edit (or vice versa).
  useEffect(() => {
    if (isOpen) {
      setFormData(initialData ?? EMPTY_FORM);
      setErrors({});
      setSubmitError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear the field-level error as soon as the user edits that field,
    // instead of waiting for the next full submit to re-validate.
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateUserForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const success = await onSubmit(formData);

    setSubmitting(false);

    if (success) {
      onRequestClose();
    } else {
      // Keep the modal open and the entered data intact so the user
      // doesn't lose their input if the (simulated) API call fails.
      setSubmitError('Could not save this user. Please try again.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={modalStyles}
      contentLabel={isEditMode ? 'Edit User' : 'Add User'}
      ariaHideApp={process.env.NODE_ENV !== 'test'}
    >
      <h2 className="user-form-title">{isEditMode ? 'Edit User' : 'Add User'}</h2>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            aria-invalid={!!errors.firstName}
            aria-describedby={errors.firstName ? 'firstName-error' : undefined}
          />
          {errors.firstName && <p id="firstName-error" className="field-error">{errors.firstName}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            aria-invalid={!!errors.lastName}
            aria-describedby={errors.lastName ? 'lastName-error' : undefined}
          />
          {errors.lastName && <p id="lastName-error" className="field-error">{errors.lastName}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && <p id="email-error" className="field-error">{errors.email}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="department">Department</label>
          <input
            id="department"
            name="department"
            type="text"
            value={formData.department}
            onChange={handleChange}
            aria-invalid={!!errors.department}
            aria-describedby={errors.department ? 'department-error' : undefined}
          />
          {errors.department && <p id="department-error" className="field-error">{errors.department}</p>}
        </div>

        {submitError && <p className="form-submit-error" role="alert">{submitError}</p>}

        <div className="form-actions">
          <button type="button" className="btn btn-cancel" onClick={onRequestClose} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="btn btn-save" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default UserFormModal;