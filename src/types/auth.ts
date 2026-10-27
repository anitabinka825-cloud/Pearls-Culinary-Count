export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role?: 'customer' | 'admin';
  createdAt?: string;
  updatedAt?: string;
}
