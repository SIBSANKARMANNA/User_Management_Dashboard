/**
 * Shape of a user as returned by JSONPlaceholder's /users endpoint.
 * NOTE: The real API only returns `name` (full name) and `company.name`.
 * We map these to firstName/lastName/department ourselves — see utils/userMapper.ts.
 * This is documented as an assumption in the README.
 */
export interface RawApiUser {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

/**
 * Shape of a user as used throughout our UI.
 * This is the "normalized" shape produced by userMapper.ts.
 */
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
}

/**
 * Shape of the form data collected in the Add/Edit modal.
 * Same fields as User, minus `id` (id is assigned by the server on create,
 * or already known when editing).
 */
export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
}

/**
 * Normalized error shape used across the app so every component
 * can rely on the same { message, status } structure regardless
 * of what axios throws.
 */
export interface ApiError {
  message: string;
  status?: number;
}