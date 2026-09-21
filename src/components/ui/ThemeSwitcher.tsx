"use client"

import { Sun, Moon } from "lucide-react";

export default function ThemeSwitcher() {
    const toggleMode = () => {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
    return (
        <button
            type="button"
            aria-label="Switch theme"
            className="grid place-items-center w-10 h-10 rounded-control
            bg-surface border border-line text-ink-2 dark:text-switcher-sun
            hover:bg-subtle"
            onClick={() => toggleMode()}
            >
            <Moon size={18} aria-hidden="true" className="dark:hidden" />
            <Sun size={18} aria-hidden="true" className="hidden dark:block"/>
        </button>
    );
}