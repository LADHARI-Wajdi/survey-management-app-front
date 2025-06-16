export enum UserRole {
  ADMIN = 'admin',
  INVESTIGATOR = 'investigator',
  PARTICIPANT = 'participant',
  ADMIN_MAJ = 'admin',
  INVESTIGATOR_MAJ = 'investigator',
  PARTICIPANT_MAJ = 'participant',
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: UserRole[];
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAuth {
  email: string;
  password: string;
  roles?: UserRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
  roles: UserRole;
}

export interface UserProfile extends User {
  phone?: string;
  address?: string;
  organization?: string;
  bio?: string;
  preferences?: {
  notifications: boolean;
  language: string;
  theme: string;
  };
}
