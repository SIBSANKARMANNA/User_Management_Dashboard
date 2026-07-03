import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import type { FilterCriteria } from '../../types/filters';
import { EMPTY_FILTERS } from '../../types/filters';
import '../../styles/forms.css';
import './FilterPopup.css';

interface FilterPopupProps {
  isOpen: boolean;
  onRequestClose: () => void;
  /** The filters currently applied, used to pre-fill the form each time it opens. */
  filters: FilterCriteria;
  /** Called with the new filter values when the user clicks Apply. */
  onApply: (filters: FilterCriteria) => void;
  /** Called when the user clicks Clear — resets the applied filters entirely. */
  onClear: () => void;
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
    maxWidth: '400px',
    borderRadius: '8px',
    padding: '1.5rem',
  },
};

/**
 * Filter popup with one text input per filterable field. Uses a local
 * "draft" copy of the filters so typing in the fields doesn't affect
 * the table until the user explicitly clicks Apply — Cancel/close
 * discards the draft and leaves the previously applied filters intact.
 */
function FilterPopup({ isOpen, onRequestClose, filters, onApply, onClear }: FilterPopupProps) {
  const [draft, setDraft] = useState<FilterCriteria>(filters);

  // Re-sync the draft to the currently applied filters every time the
  // popup opens, so it doesn't show stale edits from a previous open
  // that was cancelled without applying.
  useEffect(() => {
    if (isOpen) {
      setDraft(filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDraft((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    onApply(draft);
    onRequestClose();
  };

  const handleClear = () => {
    setDraft(EMPTY_FILTERS);
    onClear();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={modalStyles}
      contentLabel="Filter Users"
      ariaHideApp={process.env.NODE_ENV !== 'test'}
    >
      <h2 className="filter-popup-title">Filter Users</h2>

      <div className="form-field">
        <label htmlFor="filter-firstName">First Name</label>
        <input
          id="filter-firstName"
          name="firstName"
          type="text"
          value={draft.firstName}
          onChange={handleChange}
        />
      </div>

      <div className="form-field">
        <label htmlFor="filter-lastName">Last Name</label>
        <input
          id="filter-lastName"
          name="lastName"
          type="text"
          value={draft.lastName}
          onChange={handleChange}
        />
      </div>

      <div className="form-field">
        <label htmlFor="filter-email">Email</label>
        <input
          id="filter-email"
          name="email"
          type="text"
          value={draft.email}
          onChange={handleChange}
        />
      </div>

      <div className="form-field">
        <label htmlFor="filter-department">Department</label>
        <input
          id="filter-department"
          name="department"
          type="text"
          value={draft.department}
          onChange={handleChange}
        />
      </div>

      <div className="filter-popup-actions">
        <button type="button" className="btn btn-cancel" onClick={handleClear}>
          Clear
        </button>
        <div className="filter-popup-actions-right">
          <button type="button" className="btn btn-cancel" onClick={onRequestClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-save" onClick={handleApply}>
            Apply
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default FilterPopup;