import type { RawApiUser, User, UserFormData } from '../types/user';


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


export function mapRawUsersToUsers(rawUsers: RawApiUser[]): User[] {
  return rawUsers.map(mapRawUserToUser);
}


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


export function mapUserToFormData(user: User): UserFormData {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    department: user.department,
  };
}