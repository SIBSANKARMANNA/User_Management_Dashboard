// import { useState } from 'react';
// import useUsers from './hooks/useUsers';
// import UserTable from './components/UserTable/UserTable';
// import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
// import ErrorBanner from './components/ErrorBanner/ErrorBanner';
// import type { User } from './types/user';
// import './App.css';

// /**
//  * Top-level page component. Owns no data-fetching logic itself —
//  * that all lives in useUsers — this component's job is purely to
//  * decide what to render based on the hook's current state
//  * (loading / error / data) and wire user actions to the hook's
//  * mutation functions.
//  *
//  * NOTE: Edit and Delete currently just track which user was selected.
//  * The actual Add/Edit form modal and Delete confirmation modal are
//  * added in later steps (UserFormModal, DeleteConfirmModal) and will
//  * read/clear this same state.
//  */
// function App() {
//   const { users, loading, error, refetch } = useUsers();

//   // Tracks which user (if any) is currently targeted for edit/delete.
//   // null means "no modal open". Wired up fully once the modal
//   // components exist.
//   const [userPendingEdit, setUserPendingEdit] = useState<User | null>(null);
//   const [userPendingDelete, setUserPendingDelete] = useState<User | null>(null);
//   const [dismissedError, setDismissedError] = useState<boolean>(false);

//   const handleEdit = (user: User) => {
//     setUserPendingEdit(user);
//   };

//   const handleDelete = (user: User) => {
//     setUserPendingDelete(user);
//   };

//   const visibleError = error && !dismissedError ? error : null;

//   return (
//     <div className="app-container">
//       <header className="app-header">
//         <h1>User Management Dashboard</h1>
//       </header>

//       <main className="app-main">
//         {visibleError && (
//           <div className="app-error-row">
//             <ErrorBanner error={visibleError} onDismiss={() => setDismissedError(true)} />
//             {users.length === 0 && (
//               <button type="button" className="btn btn-retry" onClick={refetch}>
//                 Retry
//               </button>
//             )}
//           </div>
//         )}

//         {loading ? (
//           <LoadingSpinner label="Loading users..." />
//         ) : (
//           <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} />
//         )}
//       </main>

//       {/* Temporary dev-only visibility into pending selections until
//           Step 6/7 modals replace this. Harmless to leave in — renders nothing
//           when both are null. */}
//       {(userPendingEdit || userPendingDelete) && (
//         <div className="app-pending-debug" aria-hidden="true">
//           {userPendingEdit && <p>Pending edit: {userPendingEdit.firstName} {userPendingEdit.lastName}</p>}
//           {userPendingDelete && <p>Pending delete: {userPendingDelete.firstName} {userPendingDelete.lastName}</p>}
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;

// import { useState } from 'react';
// import useUsers from './hooks/useUsers';
// import UserTable from './components/UserTable/UserTable';
// import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
// import ErrorBanner from './components/ErrorBanner/ErrorBanner';
// import UserFormModal from './components/UserFormModal/UserFormModal';
// import DeleteConfirmModal from './components/DeleteConfirmModal/DeleteConfirmModal';
// import type { User, UserFormData } from './types/user';
// import './App.css';

// /**
//  * Top-level page component. Owns no data-fetching logic itself —
//  * that all lives in useUsers — this component's job is purely to
//  * decide what to render based on the hook's current state
//  * (loading / error / data) and wire user actions to the hook's
//  * mutation functions.
//  */
// function App() {
//   const { users, loading, error, addUser, editUser, removeUser, refetch } = useUsers();

//   // "Add" modal is a simple boolean since it has no associated row.
//   const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

//   // "Edit" and "Delete" modals are keyed off which user (if any) is the
//   // target — null means closed. This avoids tracking isOpen and the
//   // target user as two separate values that could get out of sync.
//   const [userPendingEdit, setUserPendingEdit] = useState<User | null>(null);
//   const [userPendingDelete, setUserPendingDelete] = useState<User | null>(null);

//   const [dismissedError, setDismissedError] = useState<boolean>(false);

//   const visibleError = error && !dismissedError ? error : null;

//   const handleAddSubmit = async (formData: UserFormData): Promise<boolean> => {
//     return addUser(formData);
//   };

//   const handleEditSubmit = async (formData: UserFormData): Promise<boolean> => {
//     if (!userPendingEdit) return false;
//     return editUser(userPendingEdit.id, formData);
//   };

//   const handleDeleteConfirm = async (): Promise<boolean> => {
//     if (!userPendingDelete) return false;
//     return removeUser(userPendingDelete.id);
//   };

//   return (
//     <div className="app-container">
//       <header className="app-header">
//         <h1>User Management Dashboard</h1>
//       </header>

//       <main className="app-main">
//         {visibleError && (
//           <div className="app-error-row">
//             <ErrorBanner error={visibleError} onDismiss={() => setDismissedError(true)} />
//             {users.length === 0 && (
//               <button type="button" className="btn btn-retry" onClick={refetch}>
//                 Retry
//               </button>
//             )}
//           </div>
//         )}

//         {loading ? (
//           <LoadingSpinner label="Loading users..." />
//         ) : (
//           <UserTable users={users} onEdit={setUserPendingEdit} onDelete={setUserPendingDelete} />
//         )}
//       </main>

//       {/* Fixed bottom-right "Add" button, per the original UI spec. */}
//       <button
//         type="button"
//         className="fab-add-user"
//         onClick={() => setIsAddModalOpen(true)}
//         aria-label="Add User"
//       >
//         +
//       </button>

//       <UserFormModal
//         isOpen={isAddModalOpen}
//         onRequestClose={() => setIsAddModalOpen(false)}
//         onSubmit={handleAddSubmit}
//       />

//       <UserFormModal
//         isOpen={userPendingEdit !== null}
//         onRequestClose={() => setUserPendingEdit(null)}
//         onSubmit={handleEditSubmit}
//         initialData={userPendingEdit ?? undefined}
//       />

//       <DeleteConfirmModal
//         isOpen={userPendingDelete !== null}
//         user={userPendingDelete}
//         onRequestClose={() => setUserPendingDelete(null)}
//         onConfirm={handleDeleteConfirm}
//       />
//     </div>
//   );
// }

// export default App;


// import { useState } from 'react';
// import useUsers from './hooks/useUsers';
// import usePagination from './hooks/usePagination';
// import UserTable from './components/UserTable/UserTable';
// import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
// import ErrorBanner from './components/ErrorBanner/ErrorBanner';
// import UserFormModal from './components/UserFormModal/UserFormModal';
// import DeleteConfirmModal from './components/DeleteConfirmModal/DeleteConfirmModal';
// import Pagination from './components/Pagination/Pagination';
// import type { User, UserFormData } from './types/user';
// import './App.css';

// /**
//  * Top-level page component. Owns no data-fetching logic itself —
//  * that all lives in useUsers — this component's job is purely to
//  * decide what to render based on the hook's current state
//  * (loading / error / data) and wire user actions to the hook's
//  * mutation functions.
//  */
// function App() {
//   const { users, loading, error, addUser, editUser, removeUser, refetch } = useUsers();

//   // "Add" modal is a simple boolean since it has no associated row.
//   const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

//   // "Edit" and "Delete" modals are keyed off which user (if any) is the
//   // target — null means closed. This avoids tracking isOpen and the
//   // target user as two separate values that could get out of sync.
//   const [userPendingEdit, setUserPendingEdit] = useState<User | null>(null);
//   const [userPendingDelete, setUserPendingDelete] = useState<User | null>(null);

//   const [dismissedError, setDismissedError] = useState<boolean>(false);

//   // Pagination operates on `users` directly for now. Once search/filter/sort
//   // (Step 9) are added, this will instead paginate the already-filtered
//   // list so page numbers reflect the filtered result set, not the full one.
//   const {
//     currentPage,
//     totalPages,
//     itemsPerPage,
//     visibleItems: paginatedUsers,
//     totalItems,
//     goToPage,
//     changeItemsPerPage,
//     hasNextPage,
//     hasPrevPage,
//   } = usePagination(users, 10);

//   const visibleError = error && !dismissedError ? error : null;

//   const handleAddSubmit = async (formData: UserFormData): Promise<boolean> => {
//     return addUser(formData);
//   };

//   const handleEditSubmit = async (formData: UserFormData): Promise<boolean> => {
//     if (!userPendingEdit) return false;
//     return editUser(userPendingEdit.id, formData);
//   };

//   const handleDeleteConfirm = async (): Promise<boolean> => {
//     if (!userPendingDelete) return false;
//     return removeUser(userPendingDelete.id);
//   };

//   return (
//     <div className="app-container">
//       <header className="app-header">
//         <h1>User Management Dashboard</h1>
//       </header>

//       <main className="app-main">
//         {visibleError && (
//           <div className="app-error-row">
//             <ErrorBanner error={visibleError} onDismiss={() => setDismissedError(true)} />
//             {users.length === 0 && (
//               <button type="button" className="btn btn-retry" onClick={refetch}>
//                 Retry
//               </button>
//             )}
//           </div>
//         )}

//         {loading ? (
//           <LoadingSpinner label="Loading users..." />
//         ) : (
//           <>
//             <UserTable users={paginatedUsers} onEdit={setUserPendingEdit} onDelete={setUserPendingDelete} />
//             <Pagination
//               currentPage={currentPage}
//               totalPages={totalPages}
//               itemsPerPage={itemsPerPage}
//               totalItems={totalItems}
//               hasNextPage={hasNextPage}
//               hasPrevPage={hasPrevPage}
//               onPageChange={goToPage}
//               onItemsPerPageChange={changeItemsPerPage}
//             />
//           </>
//         )}
//       </main>

//       {/* Fixed bottom-right "Add" button, per the original UI spec. */}
//       <button
//         type="button"
//         className="fab-add-user"
//         onClick={() => setIsAddModalOpen(true)}
//         aria-label="Add User"
//       >
//         +
//       </button>

//       <UserFormModal
//         isOpen={isAddModalOpen}
//         onRequestClose={() => setIsAddModalOpen(false)}
//         onSubmit={handleAddSubmit}
//       />

//       <UserFormModal
//         isOpen={userPendingEdit !== null}
//         onRequestClose={() => setUserPendingEdit(null)}
//         onSubmit={handleEditSubmit}
//         initialData={userPendingEdit ?? undefined}
//       />

//       <DeleteConfirmModal
//         isOpen={userPendingDelete !== null}
//         user={userPendingDelete}
//         onRequestClose={() => setUserPendingDelete(null)}
//         onConfirm={handleDeleteConfirm}
//       />
//     </div>
//   );
// }

// export default App;


// import { useState } from 'react';
// import useUsers from './hooks/useUsers';
// import usePagination from './hooks/usePagination';
// import useUserFilters from './hooks/useUserFilters';
// import UserTable from './components/UserTable/UserTable';
// import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
// import ErrorBanner from './components/ErrorBanner/ErrorBanner';
// import UserFormModal from './components/UserFormModal/UserFormModal';
// import DeleteConfirmModal from './components/DeleteConfirmModal/DeleteConfirmModal';
// import Pagination from './components/Pagination/Pagination';
// import SearchBar from './components/SearchBar/SearchBar';
// import type { User, UserFormData } from './types/user';
// import './App.css';

// /**
//  * Top-level page component. Owns no data-fetching logic itself —
//  * that all lives in useUsers — this component's job is purely to
//  * decide what to render based on the hook's current state
//  * (loading / error / data) and wire user actions to the hook's
//  * mutation functions.
//  */
// function App() {
//   const { users, loading, error, addUser, editUser, removeUser, refetch } = useUsers();

//   // "Add" modal is a simple boolean since it has no associated row.
//   const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

//   // "Edit" and "Delete" modals are keyed off which user (if any) is the
//   // target — null means closed. This avoids tracking isOpen and the
//   // target user as two separate values that could get out of sync.
//   const [userPendingEdit, setUserPendingEdit] = useState<User | null>(null);
//   const [userPendingDelete, setUserPendingDelete] = useState<User | null>(null);

//   const [dismissedError, setDismissedError] = useState<boolean>(false);

//   const {
//     searchTerm,
//     setSearchTerm,
//     sortField,
//     sortDirection,
//     toggleSort,
//     processedUsers,
//   } = useUserFilters(users);

//   // Pagination now operates on the already searched/sorted list, so page
//   // numbers and page contents always reflect the current search — not
//   // the full unfiltered user set.
//   const {
//     currentPage,
//     totalPages,
//     itemsPerPage,
//     visibleItems: paginatedUsers,
//     totalItems,
//     goToPage,
//     changeItemsPerPage,
//     hasNextPage,
//     hasPrevPage,
//   } = usePagination(processedUsers, 10);

//   const visibleError = error && !dismissedError ? error : null;

//   const handleAddSubmit = async (formData: UserFormData): Promise<boolean> => {
//     return addUser(formData);
//   };

//   const handleEditSubmit = async (formData: UserFormData): Promise<boolean> => {
//     if (!userPendingEdit) return false;
//     return editUser(userPendingEdit.id, formData);
//   };

//   const handleDeleteConfirm = async (): Promise<boolean> => {
//     if (!userPendingDelete) return false;
//     return removeUser(userPendingDelete.id);
//   };

//   return (
//     <div className="app-container">
//       <header className="app-header">
//         <h1>User Management Dashboard</h1>
//       </header>

//       <main className="app-main">
//         {visibleError && (
//           <div className="app-error-row">
//             <ErrorBanner error={visibleError} onDismiss={() => setDismissedError(true)} />
//             {users.length === 0 && (
//               <button type="button" className="btn btn-retry" onClick={refetch}>
//                 Retry
//               </button>
//             )}
//           </div>
//         )}

//         {loading ? (
//           <LoadingSpinner label="Loading users..." />
//         ) : (
//           <>
//             <div className="app-toolbar">
//               <SearchBar value={searchTerm} onChange={setSearchTerm} />
//             </div>

//             <UserTable
//               users={paginatedUsers}
//               onEdit={setUserPendingEdit}
//               onDelete={setUserPendingDelete}
//               sortField={sortField}
//               sortDirection={sortDirection}
//               onSort={toggleSort}
//             />
//             <Pagination
//               currentPage={currentPage}
//               totalPages={totalPages}
//               itemsPerPage={itemsPerPage}
//               totalItems={totalItems}
//               hasNextPage={hasNextPage}
//               hasPrevPage={hasPrevPage}
//               onPageChange={goToPage}
//               onItemsPerPageChange={changeItemsPerPage}
//             />
//           </>
//         )}
//       </main>

//       {/* Fixed bottom-right "Add" button, per the original UI spec. */}
//       <button
//         type="button"
//         className="fab-add-user"
//         onClick={() => setIsAddModalOpen(true)}
//         aria-label="Add User"
//       >
//         +
//       </button>

//       <UserFormModal
//         isOpen={isAddModalOpen}
//         onRequestClose={() => setIsAddModalOpen(false)}
//         onSubmit={handleAddSubmit}
//       />

//       <UserFormModal
//         isOpen={userPendingEdit !== null}
//         onRequestClose={() => setUserPendingEdit(null)}
//         onSubmit={handleEditSubmit}
//         initialData={userPendingEdit ?? undefined}
//       />

//       <DeleteConfirmModal
//         isOpen={userPendingDelete !== null}
//         user={userPendingDelete}
//         onRequestClose={() => setUserPendingDelete(null)}
//         onConfirm={handleDeleteConfirm}
//       />
//     </div>
//   );
// }

// export default App;


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

/**
 * Top-level page component. Owns no data-fetching logic itself —
 * that all lives in useUsers — this component's job is purely to
 * decide what to render based on the hook's current state
 * (loading / error / data) and wire user actions to the hook's
 * mutation functions.
 */
function App() {
  const { users, loading, error, addUser, editUser, removeUser, refetch } = useUsers();

  // "Add" modal is a simple boolean since it has no associated row.
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // "Edit" and "Delete" modals are keyed off which user (if any) is the
  // target — null means closed. This avoids tracking isOpen and the
  // target user as two separate values that could get out of sync.
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

  // Pagination now operates on the already searched/sorted list, so page
  // numbers and page contents always reflect the current search — not
  // the full unfiltered user set.
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

      {/* Fixed bottom-right "Add" button, per the original UI spec. */}
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