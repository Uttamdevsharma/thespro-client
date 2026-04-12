export type Role = 'student' | 'supervisor' | 'committee' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  token: string;
  researchCell?: any;
  researchCells?: any[];
  isCourseSupervisor?: boolean;
  mainSupervisor?: string;
  [key: string]: any;
}

export interface AuthState {
  user: User | null;
}
