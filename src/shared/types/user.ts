export type UserRole = "user" | "admin";

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  bio?: string;
  avatarUrl?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  fieldErrors?: Record<string, string>;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface ProfileUpdatePayload {
  displayName: string;
  bio?: string;
  avatarUrl?: string;
}
