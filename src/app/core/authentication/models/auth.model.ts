import { UserRole } from "./user.model";

export interface authModule {
  email: string;
  password: string;
  roles: UserRole;
}