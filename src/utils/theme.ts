// Theme management utilities

const THEME_KEY = "mallManagementTheme";

export type Theme = "light" | "dark";

export const getTheme = (): Theme => {
  const stored = localStorage.getItem(THEME_KEY);
  return (stored as Theme) || "light";
};

export const setTheme = (theme: Theme): void => {
  localStorage.setItem(THEME_KEY, theme);
  document.documentElement.classList.toggle("dark", theme === "dark");
};

export const initTheme = (): void => {
  const theme = getTheme();
  document.documentElement.classList.toggle("dark", theme === "dark");
};

export const toggleTheme = (): Theme => {
  const current = getTheme();
  const newTheme = current === "light" ? "dark" : "light";
  setTheme(newTheme);
  return newTheme;
};
