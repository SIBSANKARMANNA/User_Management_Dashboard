import { AxiosError } from 'axios';
import httpClient from './httpClient';
import type { RawApiUser, UserFormData, ApiError } from '../types/user';


function normalizeError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    return {
      message: error.response?.data?.message || error.message || 'Request failed',
      status: error.response?.status,
    };
  }
  return { message: 'An unexpected error occurred' };
}


export async function getUsers(): Promise<RawApiUser[]> {
  try {
    const response = await httpClient.get<RawApiUser[]>('/users');
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}


export async function createUser(userData: UserFormData): Promise<RawApiUser> {
  try {
    const response = await httpClient.post<RawApiUser>('/users', userData);
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}


export async function updateUser(id: number, userData: UserFormData): Promise<RawApiUser> {
  try {
    const response = await httpClient.put<RawApiUser>(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}


export async function deleteUser(id: number): Promise<void> {
  try {
    await httpClient.delete(`/users/${id}`);
  } catch (error) {
    throw normalizeError(error);
  }
}