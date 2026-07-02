
import  { useState } from 'react';
import useUsers from './hooks/useUsers';
import usePagination from './hooks/usePagination';
import useUserFilters from './hooks/useUserFilters';
import UserTable from './components/UserTable/UserTable';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import ErrorBanner from './components/ErrorBanner/ErrorBanner';
import UserFormModal from './components/UserFormModal/UserFormModal';
import DeleteConfirmModal from './components/DeleteConfirmModal/DeleteConfirmModal';
import Pagination from './components/Pagination/Pagination';
import SearchBar from './components/SearchBar/SearchBar';
import type { User, UserFormData } from './types/user';
import './App.css';


function App() {
  const { users, loading, error, addUser, editUser, removeUser, refetch } = useUsers();


  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);


  const [userPendingEdit, setUserPendingEdit] = useState<User | null>(null);
  const [userPendingDelete, setUserPendingDelete] = useState<User | null>(null);

  const [dismissedError, setDismissedError] = useState<boolean>(false);

  const {
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    toggleSort,
    processedUsers,
  } = useUserFilters(users);


  const {
    currentPage,
    totalPages,
    itemsPerPage,
    visibleItems: paginatedUsers,
    totalItems,
    goToPage,
    changeItemsPerPage,
    hasNextPage,
    hasPrevPage,
  } = usePagination(processedUsers, 10);

  const visibleError = error && !dismissedError ? error : null;

  const handleAddSubmit = async (formData: UserFormData): Promise<boolean> => {
    return addUser(formData);
  };

  const handleEditSubmit = async (formData: UserFormData): Promise<boolean> => {
    if (!userPendingEdit) return false;
    return editUser(userPendingEdit.id, formData);
  };

  const handleDeleteConfirm = async (): Promise<boolean> => {
    if (!userPendingDelete) return false;
    return removeUser(userPendingDelete.id);
  };

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
          <>
            <div className="app-toolbar">
              <SearchBar value={searchTerm} onChange={setSearchTerm} />
            </div>

            <UserTable
              users={paginatedUsers}
              onEdit={setUserPendingEdit}
              onDelete={setUserPendingDelete}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={toggleSort}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
              hasNextPage={hasNextPage}
              hasPrevPage={hasPrevPage}
              onPageChange={goToPage}
              onItemsPerPageChange={changeItemsPerPage}
            />
          </>
        )}
      </main>

      <button
        type="button"
        className="fab-add-user"
        onClick={() => setIsAddModalOpen(true)}
        aria-label="Add User"
      >
        +
      </button>

      <UserFormModal
        isOpen={isAddModalOpen}
        onRequestClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
      />

      <UserFormModal
        isOpen={userPendingEdit !== null}
        onRequestClose={() => setUserPendingEdit(null)}
        onSubmit={handleEditSubmit}
        initialData={userPendingEdit ?? undefined}
      />

      <DeleteConfirmModal
        isOpen={userPendingDelete !== null}
        user={userPendingDelete}
        onRequestClose={() => setUserPendingDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

export default App;