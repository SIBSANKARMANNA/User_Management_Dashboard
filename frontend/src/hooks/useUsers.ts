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


function generateNextId(users: User[]): number {
  if (users.length === 0) return 1;
  return Math.max(...users.map((u) => u.id)) + 1;
}

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