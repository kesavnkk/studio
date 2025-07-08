export type Priority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  detail: string;
  reminderDate: string; // ISO string
  priority: Priority;
  isCompleted: boolean;
  notified: boolean;
}

export interface User {
  email: string;
  // NOTE: In a real application, passwords should be hashed securely on a server.
  // Storing plain text or easily reversible passwords in localStorage is not secure.
  password: string; 
}
