// src/app/core/models/user.model.ts
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