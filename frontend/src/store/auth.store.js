// store/auth.store.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: (userData, token) => {
        console.log("🔵 Login called with:", userData, token);
        set({
          user: userData,
          token: token,
          isAuthenticated: true,
          isLoading: false,
        });
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userData?.id || "");
      },

      logout: () => {
        console.log("🔵 Logout called");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
      },

      setLoading: (loading) => set({ isLoading: loading }),

      // Helper to check if user is logged in
      isLoggedIn: () => {
        const state = get();
        return state.isAuthenticated && state.user !== null;
      },
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    },
  ),
);
