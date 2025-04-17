// core/models/user.model.ts
export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
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
