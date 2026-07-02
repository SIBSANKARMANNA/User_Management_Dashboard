import { validateEmail, validateUserForm, isFormValid } from './validators';
import type { UserFormData } from '../types/user';

const validForm: UserFormData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  department: 'Engineering',
};

describe('validateEmail', () => {
  it('returns undefined for a valid email', () => {
    expect(validateEmail('test@example.com')).toBeUndefined();
  });

  it('returns an error for an empty email', () => {
    expect(validateEmail('')).toBe('Email is required');
  });

  it('returns an error for an email missing "@"', () => {
    expect(validateEmail('testexample.com')).toBe('Enter a valid email address');
  });

  it('returns an error for an email missing a domain extension', () => {
    expect(validateEmail('test@example')).toBe('Enter a valid email address');
  });

  it('treats whitespace-only input as empty', () => {
    expect(validateEmail('   ')).toBe('Email is required');
  });
});

describe('validateUserForm', () => {
  it('returns no errors for a fully valid form', () => {
    expect(validateUserForm(validForm)).toEqual({});
  });

  it('flags an empty first name', () => {
    const errors = validateUserForm({ ...validForm, firstName: '' });
    expect(errors.firstName).toBe('First name is required');
  });

  it('flags a first name containing numbers', () => {
    const errors = validateUserForm({ ...validForm, firstName: 'John3' });
    expect(errors.firstName).toBe('First name can only contain letters, spaces, hyphens, and apostrophes');
  });

  it('flags an empty last name', () => {
    const errors = validateUserForm({ ...validForm, lastName: '' });
    expect(errors.lastName).toBe('Last name is required');
  });

  it('flags an empty department', () => {
    const errors = validateUserForm({ ...validForm, department: '' });
    expect(errors.department).toBe('Department is required');
  });

  it('flags an invalid email', () => {
    const errors = validateUserForm({ ...validForm, email: 'not-an-email' });
    expect(errors.email).toBe('Enter a valid email address');
  });

  it('accepts hyphenated and apostrophe names', () => {
    const errors = validateUserForm({ ...validForm, firstName: "Anne-Marie", lastName: "O'Brien" });
    expect(errors.firstName).toBeUndefined();
    expect(errors.lastName).toBeUndefined();
  });

  it('returns multiple errors when several fields are invalid', () => {
    const errors = validateUserForm({ firstName: '', lastName: '', email: '', department: '' });
    expect(Object.keys(errors)).toHaveLength(4);
  });
});

describe('isFormValid', () => {
  it('returns true for a valid form', () => {
    expect(isFormValid(validForm)).toBe(true);
  });

  it('returns false when any field is invalid', () => {
    expect(isFormValid({ ...validForm, email: 'bad' })).toBe(false);
  });
});