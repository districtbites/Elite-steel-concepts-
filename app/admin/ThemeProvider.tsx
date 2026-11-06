"use client";

import React, { createContext, useContext, useEffect, useState } from"react";

type Theme ="light" |"dark" |"midnight";

interface ThemeContextType {
 theme: Theme;
 setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
 const [theme, setThemeState] = useState<Theme>("dark");
 const [mounted, setMounted] = useState(false);

 useEffect(() => {
 setMounted(true);
 const saved = localStorage.getItem("admin-theme") as Theme;
 if (saved && ["light","dark","midnight"].includes(saved)) {
 setThemeState(saved);
 document.documentElement.setAttribute("data-admin-theme", saved);
 } else {
 document.documentElement.setAttribute("data-admin-theme","dark");
 }
 }, []);

 const setTheme = (t: Theme) => {
 setThemeState(t);
 localStorage.setItem("admin-theme", t);
 document.documentElement.setAttribute("data-admin-theme", t);
 };

 return (
 <ThemeContext.Provider value={{ theme, setTheme }}>
 <div style={{ visibility: mounted ?"visible" :"hidden" }}>
 {children}
 </div>
 </ThemeContext.Provider>
 );
}

export const useAdminTheme = () => {
 const ctx = useContext(ThemeContext);
 if (!ctx) throw new Error("useAdminTheme must be used within ThemeProvider");
 return ctx;
};
