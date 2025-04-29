// core/models/user.model.ts
export enum UserRole {
  ADMIN = 'admin',
  INVESTIGATOR = 'investigator',
  PARTICIPANT = 'participant'
}

// Interface principale pour l'utilisateur
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

// Interface pour l'authentification utilisateur
export interface UserAuth {
  email: string;
  password: string;
  role?: UserRole;
}

// Interface pour les informations de connexion
export interface LoginCredentials {
  email: string;
  password: string;
  roles:UserRole;
}

// Interface étendue avec des informations de profil
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