export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  company?: string | null;
  website?: string | null;
  createdAt?: string | Date;
  userId: string;
}