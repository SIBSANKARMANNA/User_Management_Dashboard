import type { UserFormData } from '../types/user';


const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


const NAME_REGEX = /^[A-Za-z\s'-]+$/;

export type FormErrors = Partial<Record<keyof UserFormData, string>>;


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


export function isFormValid(formData: UserFormData): boolean {
  return Object.keys(validateUserForm(formData)).length === 0;
}