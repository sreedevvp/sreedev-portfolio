"use client";

import { useEffect, useState } from "react";
import { PiMoonStarsFill, PiSunBold } from "react-icons/pi";

const STORAGE_KEY = "sreedev-theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const currentTheme =
      document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    setTheme(currentTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    const root = document.documentElement;

    root.classList.add("theme-transitioning");
    root.dataset.theme = nextTheme;
    root.style.colorScheme = nextTheme;
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    setTheme(nextTheme);

    window.setTimeout(() => root.classList.remove("theme-transitioning"), 620);
  };

  const isDark = theme === "dark";

  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-pressed={isDark}
      onClick={toggleTheme}
    >
      <PiMoonStarsFill className="theme-icon theme-icon-moon" aria-hidden="true" />
      <PiSunBold className="theme-icon theme-icon-sun" aria-hidden="true" />
    </button>
  );
}
