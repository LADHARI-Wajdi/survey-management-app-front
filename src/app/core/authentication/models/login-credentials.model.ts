import { UserRole } from "./user.model";

export interface LoginCredentials {
  username: string;
  password: string;
  role: UserRole;
}