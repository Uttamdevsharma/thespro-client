export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'supervisor' | 'committee' | 'admin';
  token?: string;
  cohort?: any;
  department?: any;
  studentId?: string;
  currentCGPA?: number;
  profilePicture?: string;
  // Add other fields as discovered from the original project
}

export interface AuthState {
  user: User | null;
}
