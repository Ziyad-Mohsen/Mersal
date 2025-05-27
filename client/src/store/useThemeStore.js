import { create } from "zustand";

export const useThemeStore = create((set, get) => ({
  isDark: Boolean(localStorage.getItem("dark-mode") === "true"),
  toggleTheme: () => {
    set({ isDark: !get().isDark });
  },
}));
