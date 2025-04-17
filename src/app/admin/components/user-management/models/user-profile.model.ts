export enum UserRole {
  ADMIN = 'ADMIN',
  INVESTIGATOR = 'INVESTIGATOR',
  PARTICIPANT = 'PARTICIPANT',
}

export interface UserProfileModel {
  id?: string;
  username: string;
  email: string;
  password?: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}
