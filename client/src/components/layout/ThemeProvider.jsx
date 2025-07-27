import { createContext, useContext, useEffect, useState } from "react";

const ThemeProviderContext = createContext({
  theme: "system",
  setTheme: () => null,
});

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem(storageKey) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("spring", "summer", "autumn", "winter", "purple");

    if (theme === "system") {
      const now = new Date();
      const month = now.getMonth();
      let systemTheme;
      
      if (month >= 2 && month <= 4) systemTheme = "spring"; // Mar-May
      else if (month >= 5 && month <= 7) systemTheme = "summer"; // Jun-Aug  
      else if (month >= 8 && month <= 10) systemTheme = "autumn"; // Sep-Nov
      else systemTheme = "purple"; // Dec-Feb (changed from winter to purple)

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};