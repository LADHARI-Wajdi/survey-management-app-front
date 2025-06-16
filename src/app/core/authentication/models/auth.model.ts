import { UserRole } from "./user.model";

export interface authModule {
  username: string;
  password: string;
  roles: UserRole;
}