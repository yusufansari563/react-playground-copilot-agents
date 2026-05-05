import { create } from "zustand";

interface AuthState {
  token: string | null;
  isAuthenticationRequired: boolean;
  setToken: (token: string) => void;
  clearSession: () => void;
  setAuthenticationRequired: (required: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("auth_token"),
  isAuthenticationRequired: false,
  setToken: (token) => {
    localStorage.setItem("auth_token", token);
    set({ token });
  },
  clearSession: () => {
    localStorage.removeItem("auth_token");
    set({ token: null });
  },
  setAuthenticationRequired: (required) => {
    set({ isAuthenticationRequired: required });
  },
}));
