import { useState } from 'react';
import useUsers from './hooks/useUsers';
import UserTable from './components/UserTable/UserTable';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import ErrorBanner from './components/ErrorBanner/ErrorBanner';
import type { User } from './types/user';
import './App.css';

/**
 * Top-level page component. Owns no data-fetching logic itself —
 * that all lives in useUsers — this component's job is purely to
 * decide what to render based on the hook's current state
 * (loading / error / data) and wire user actions to the hook's
 * mutation functions.
 *
 * NOTE: Edit and Delete currently just track which user was selected.
 * The actual Add/Edit form modal and Delete confirmation modal are
 * added in later steps (UserFormModal, DeleteConfirmModal) and will
 * read/clear this same state.
 */
function App() {
  const { users, loading, error, refetch } = useUsers();

  // Tracks which user (if any) is currently targeted for edit/delete.
  // null means "no modal open". Wired up fully once the modal
  // components exist.
  const [userPendingEdit, setUserPendingEdit] = useState<User | null>(null);
  const [userPendingDelete, setUserPendingDelete] = useState<User | null>(null);
  const [dismissedError, setDismissedError] = useState<boolean>(false);

  const handleEdit = (user: User) => {
    setUserPendingEdit(user);
  };

  const handleDelete = (user: User) => {
    setUserPendingDelete(user);
  };

  const visibleError = error && !dismissedError ? error : null;

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>User Management Dashboard</h1>
      </header>

      <main className="app-main">
        {visibleError && (
          <div className="app-error-row">
            <ErrorBanner error={visibleError} onDismiss={() => setDismissedError(true)} />
            {users.length === 0 && (
              <button type="button" className="btn btn-retry" onClick={refetch}>
                Retry
              </button>
            )}
          </div>
        )}

        {loading ? (
          <LoadingSpinner label="Loading users..." />
        ) : (
          <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </main>

      {/* Temporary dev-only visibility into pending selections until
          Step 6/7 modals replace this. Harmless to leave in — renders nothing
          when both are null. */}
      {(userPendingEdit || userPendingDelete) && (
        <div className="app-pending-debug" aria-hidden="true">
          {userPendingEdit && <p>Pending edit: {userPendingEdit.firstName} {userPendingEdit.lastName}</p>}
          {userPendingDelete && <p>Pending delete: {userPendingDelete.firstName} {userPendingDelete.lastName}</p>}
        </div>
      )}
    </div>
  );
}

export default App;