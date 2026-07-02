// // import React from 'react';
// import type { User } from '../../types/user';
// import './UserTable.css';

// interface UserTableProps {
//   users: User[];
//   onEdit: (user: User) => void;
//   onDelete: (user: User) => void;
// }

// /**
//  * Renders the user list as a table with Edit/Delete actions per row.
//  * This component is presentation-only — it receives already-processed
//  * data (filtered/sorted/paginated) via props and has no knowledge of
//  * the API, matching the "container vs presentational" split that keeps
//  * this component easy to unit test in isolation.
//  */
// function UserTable({ users, onEdit, onDelete }: UserTableProps) {
//   if (users.length === 0) {
//     return (
//       <div className="user-table-empty" role="status">
//         <p>No users found.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="user-table-wrapper">
//       <table className="user-table">
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>First Name</th>
//             <th>Last Name</th>
//             <th>Email</th>
//             <th>Department</th>
//             <th aria-label="Actions">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map((user) => (
//             <tr key={user.id}>
//               <td data-label="ID">{user.id}</td>
//               <td data-label="First Name">{user.firstName}</td>
//               <td data-label="Last Name">{user.lastName}</td>
//               <td data-label="Email">{user.email}</td>
//               <td data-label="Department">{user.department}</td>
//               <td data-label="Actions" className="user-table-actions">
//                 <button
//                   type="button"
//                   className="btn btn-edit"
//                   onClick={() => onEdit(user)}
//                   aria-label={`Edit ${user.firstName} ${user.lastName}`}
//                 >
//                   Edit
//                 </button>
//                 <button
//                   type="button"
//                   className="btn btn-delete"
//                   onClick={() => onDelete(user)}
//                   aria-label={`Delete ${user.firstName} ${user.lastName}`}
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default UserTable;



import type { User } from '../../types/user';
import type { SortableField, SortDirection } from '../../types/filters';
import './UserTable.css';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  /**
   * Sorting is optional: when sortField/sortDirection/onSort are all
   * omitted, headers render as plain (non-interactive) text — this keeps
   * UserTable usable standalone without forcing every consumer to wire
   * up sorting.
   */
  sortField?: SortableField | null;
  sortDirection?: SortDirection;
  onSort?: (field: SortableField) => void;
}

interface ColumnDef {
  field: SortableField;
  label: string;
}

const COLUMNS: ColumnDef[] = [
  { field: 'id', label: 'ID' },
  { field: 'firstName', label: 'First Name' },
  { field: 'lastName', label: 'Last Name' },
  { field: 'email', label: 'Email' },
  { field: 'department', label: 'Department' },
];

/**
 * Renders the user list as a table with Edit/Delete actions per row.
 * This component is presentation-only — it receives already-processed
 * data (filtered/sorted/paginated) via props and has no knowledge of
 * the API, matching the "container vs presentational" split that keeps
 * this component easy to unit test in isolation.
 */
function UserTable({ users, onEdit, onDelete, sortField, sortDirection, onSort }: UserTableProps) {
  if (users.length === 0) {
    return (
      <div className="user-table-empty" role="status">
        <p>No users found.</p>
      </div>
    );
  }

  const renderSortIndicator = (field: SortableField) => {
    if (sortField !== field) return null;
    return <span className="sort-indicator">{sortDirection === 'asc' ? ' \u2191' : ' \u2193'}</span>;
  };

  return (
    <div className="user-table-wrapper">
      <table className="user-table">
        <thead>
          <tr>
            {COLUMNS.map(({ field, label }) => (
              <th key={field}>
                {onSort ? (
                  <button
                    type="button"
                    className="sort-header-btn"
                    onClick={() => onSort(field)}
                    aria-label={`Sort by ${label}`}
                  >
                    {label}
                    {renderSortIndicator(field)}
                  </button>
                ) : (
                  label
                )}
              </th>
            ))}
            <th aria-label="Actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td data-label="ID">{user.id}</td>
              <td data-label="First Name">{user.firstName}</td>
              <td data-label="Last Name">{user.lastName}</td>
              <td data-label="Email">{user.email}</td>
              <td data-label="Department">{user.department}</td>
              <td data-label="Actions" className="user-table-actions">
                <button
                  type="button"
                  className="btn btn-edit"
                  onClick={() => onEdit(user)}
                  aria-label={`Edit ${user.firstName} ${user.lastName}`}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-delete"
                  onClick={() => onDelete(user)}
                  aria-label={`Delete ${user.firstName} ${user.lastName}`}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;

