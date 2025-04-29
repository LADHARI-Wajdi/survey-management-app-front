import { UserRole } from "./user.model";

export interface LoginCredentials {
  email: string;
  password: string;
  role: UserRole;
}