
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


export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
}


export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
}


export interface ApiError {
  message: string;
  status?: number;
}