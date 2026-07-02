import type { RawApiUser, User, UserFormData } from '../types/user';

/**
 * Splits a full name string into firstName/lastName.
 * Assumption: the first word is the first name, everything after is the
 * last name (handles middle names/multi-word surnames reasonably —
 * e.g. "Clementine Bauch" -> "Clementine" / "Bauch",
 * "Mrs. Dennis Schulist" -> "Mrs." / "Dennis Schulist").
 * This is a documented assumption since JSONPlaceholder only provides
 * a single `name` field, not separate first/last name fields.
 */
function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim();
  const firstSpaceIndex = trimmed.indexOf(' ');

  if (firstSpaceIndex === -1) {
    return { firstName: trimmed, lastName: '' };
  }

  return {
    firstName: trimmed.slice(0, firstSpaceIndex),
    lastName: trimmed.slice(firstSpaceIndex + 1),
  };
}

/**
 * Converts a raw API user (JSONPlaceholder shape) into our UI-facing User shape.
 * Maps `company.name` -> `department` since JSONPlaceholder has no real
 * department field. Documented assumption, see README.
 */
export function mapRawUserToUser(rawUser: RawApiUser): User {
  const { firstName, lastName } = splitFullName(rawUser.name);

  return {
    id: rawUser.id,
    firstName,
    lastName,
    email: rawUser.email,
    department: rawUser.company?.name || 'Unassigned',
  };
}

/**
 * Converts a list of raw API users into our UI-facing User shape.
 */
export function mapRawUsersToUsers(rawUsers: RawApiUser[]): User[] {
  return rawUsers.map(mapRawUserToUser);
}

/**
 * Converts our form data (firstName/lastName/department) back into the
 * payload shape expected by the API (name/company.name), for POST/PUT requests.
 */
export function mapFormDataToApiPayload(formData: UserFormData): Partial<RawApiUser> {
  return {
    name: `${formData.firstName} ${formData.lastName}`.trim(),
    email: formData.email,
    company: {
      name: formData.department,
      catchPhrase: '',
      bs: '',
    },
  };
}

/**
 * Converts a User (UI shape) into UserFormData, used to pre-fill the
 * Edit modal from a row the table already has in local state.
 */
export function mapUserToFormData(user: User): UserFormData {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    department: user.department,
  };
}