export enum UserRole {
  ADMIN = 'admin',
  INVESTIGATOR = 'investigator',
  PARTICIPANT = 'participant',
   ADMIN_MAJ   = 'admin',
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