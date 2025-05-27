import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import { useThemeStore } from "../store/useThemeStore";

function ThemeToggle() {
  const { isDark, toggleTheme } = useThemeStore();

  useEffect(() => {
    localStorage.setItem("dark-mode", isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <button
      onClick={toggleTheme}
      className="p-1 rounded-full bg-text-light text-secondary transition-colors cursor-pointer hover:bg-text-light"
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <Sun className="transform transition-transform duration-300 rotate-180" />
      ) : (
        <Moon className="transform transition-transform duration-300 rotate-0" />
      )}
    </button>
  );
}

export default ThemeToggle;
