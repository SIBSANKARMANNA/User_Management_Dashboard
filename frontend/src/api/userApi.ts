import { AxiosError } from 'axios';
import httpClient from './httpClient';
import type { RawApiUser, UserFormData, ApiError } from '../types/user';

/**
 * Converts any error thrown by axios into our normalized ApiError shape,
 * so every caller (hooks/components) can handle errors the same way
 * regardless of whether it was a network failure, a 4xx, or a 5xx.
 */
function normalizeError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    return {
      message: error.response?.data?.message || error.message || 'Request failed',
      status: error.response?.status,
    };
  }
  return { message: 'An unexpected error occurred' };
}

/**
 * GET /users
 * Fetches all users. JSONPlaceholder always returns all 10 users —
 * there is no server-side pagination/filtering on this endpoint,
 * so pagination/search/filter/sort are all applied client-side
 * on the result of this call (see hooks/useUserFilters.ts, usePagination.ts).
 */
export async function getUsers(): Promise<RawApiUser[]> {
  try {
    const response = await httpClient.get<RawApiUser[]>('/users');
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

/**
 * POST /users
 * JSONPlaceholder simulates a successful create but does NOT persist it.
 * It also always returns id: 11 regardless of what we send, so the caller
 * (useUsers hook) is responsible for generating a realistic unique id
 * and merging the new user into local state.
 */
export async function createUser(userData: UserFormData): Promise<RawApiUser> {
  try {
    const response = await httpClient.post<RawApiUser>('/users', userData);
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

/**
 * PUT /users/:id
 * JSONPlaceholder echoes back whatever we send but does NOT persist it.
 * The caller is responsible for merging the updated fields into local state.
 */
export async function updateUser(id: number, userData: UserFormData): Promise<RawApiUser> {
  try {
    const response = await httpClient.put<RawApiUser>(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

/**
 * DELETE /users/:id
 * JSONPlaceholder returns an empty {} with a 200 status but does NOT persist it.
 * The caller is responsible for removing the user from local state.
 */
export async function deleteUser(id: number): Promise<void> {
  try {
    await httpClient.delete(`/users/${id}`);
  } catch (error) {
    throw normalizeError(error);
  }
}