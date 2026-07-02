import type { UserFormData } from '../types/user';

// Standard, reasonably strict email pattern: local@domain.tld
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Letters, spaces, hyphens, and apostrophes only — covers names like
// "Anne-Marie" or "O'Brien" while rejecting numbers/symbols.
const NAME_REGEX = /^[A-Za-z\s'-]+$/;

export type FormErrors = Partial<Record<keyof UserFormData, string>>;

/**
 * Validates a single required text field (firstName, lastName, department).
 * Returns an error message string, or undefined if valid.
 */
function validateRequiredName(value: string, fieldLabel: string): string | undefined {
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return `${fieldLabel} is required`;
  }
  if (!NAME_REGEX.test(trimmed)) {
    return `${fieldLabel} can only contain letters, spaces, hyphens, and apostrophes`;
  }
  return undefined;
}

/**
 * Validates an email address string.
 * Returns an error message string, or undefined if valid.
 */
export function validateEmail(value: string): string | undefined {
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return 'Email is required';
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return 'Enter a valid email address';
  }
  return undefined;
}

/**
 * Validates the full user form and returns a map of field -> error message.
 * An empty object means the form is valid.
 * Used by UserFormModal to block submission and show inline field errors.
 */
export function validateUserForm(formData: UserFormData): FormErrors {
  const errors: FormErrors = {};

  const firstNameError = validateRequiredName(formData.firstName, 'First name');
  if (firstNameError) errors.firstName = firstNameError;

  const lastNameError = validateRequiredName(formData.lastName, 'Last name');
  if (lastNameError) errors.lastName = lastNameError;

  const departmentError = validateRequiredName(formData.department, 'Department');
  if (departmentError) errors.department = departmentError;

  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;

  return errors;
}

/**
 * Convenience helper: true if the form has no validation errors.
 */
export function isFormValid(formData: UserFormData): boolean {
  return Object.keys(validateUserForm(formData)).length === 0;
}