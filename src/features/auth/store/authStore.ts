import { create } from "zustand";

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("auth_token"),
  setToken: (token) => {
    localStorage.setItem("auth_token", token);
    set({ token });
  },
  clearSession: () => {
    localStorage.removeItem("auth_token");
    set({ token: null });
  },
}));
