import { useState, useEffect, useCallback } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../api/userApi';
import { mapRawUsersToUsers } from '../utils/userMapper';
import type { User, UserFormData, ApiError } from '../types/user';

interface UseUsersResult {
  users: User[];
  loading: boolean;
  error: ApiError | null;
  addUser: (formData: UserFormData) => Promise<boolean>;
  editUser: (id: number, formData: UserFormData) => Promise<boolean>;
  removeUser: (id: number) => Promise<boolean>;
  refetch: () => Promise<void>;
}

/**
 * Generates a unique id for a newly added user.
 * JSONPlaceholder's POST /users always echoes back id: 11 regardless of
 * what we send, so we can't rely on the API's returned id — we generate
 * one ourselves based on the highest id currently in local state.
 * Documented assumption: see README.
 */
function generateNextId(users: User[]): number {
  if (users.length === 0) return 1;
  return Math.max(...users.map((u) => u.id)) + 1;
}

/**
 * Central hook for all user data + CRUD operations.
 *
 * Because JSONPlaceholder does not actually persist POST/PUT/DELETE
 * (it simulates success but the underlying data never changes), this
 * hook treats `users` as the local source of truth: every successful
 * API call is followed by an update to this local array so the UI
 * reflects the change even though the server "forgot" it.
 *
 * Each mutation function returns a boolean (rather than throwing) so
 * callers like modals can decide what to do on failure (e.g. keep the
 * form open) without needing a try/catch at the call site.
 */
function useUsers(): UseUsersResult {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rawUsers = await getUsers();
      setUsers(mapRawUsersToUsers(rawUsers));
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const addUser = useCallback(
    async (formData: UserFormData): Promise<boolean> => {
      setError(null);
      try {
        await createUser(formData);
        // API response is a fake echo (always id: 11), so we build the
        // local user ourselves with a generated id instead of trusting it.
        setUsers((prevUsers) => [
          ...prevUsers,
          { id: generateNextId(prevUsers), ...formData },
        ]);
        return true;
      } catch (err) {
        setError(err as ApiError);
        return false;
      }
    },
    []
  );

  const editUser = useCallback(
    async (id: number, formData: UserFormData): Promise<boolean> => {
      setError(null);
      try {
        await updateUser(id, formData);
        // API response doesn't persist, so we merge the edited fields
        // into local state ourselves rather than trusting the response.
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === id ? { id, ...formData } : user))
        );
        return true;
      } catch (err) {
        setError(err as ApiError);
        return false;
      }
    },
    []
  );

  const removeUser = useCallback(async (id: number): Promise<boolean> => {
    setError(null);
    try {
      await deleteUser(id);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      return true;
    } catch (err) {
      setError(err as ApiError);
      return false;
    }
  }, []);

  return { users, loading, error, addUser, editUser, removeUser, refetch: fetchUsers };
}

export default useUsers;