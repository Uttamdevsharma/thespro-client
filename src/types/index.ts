export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'supervisor' | 'committee';
  token?: string;
  // Add other fields as discovered from the original project
}

export interface AuthState {
  user: User | null;
}
