'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // Prevent hydration mismatch
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse" />;
    }

    const isDark = theme === 'dark';

    return (
        <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={`
                relative inline-flex items-center justify-center p-2 rounded-full transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-blue-500
                ${isDark ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 dark:text-gray-300 hover:bg-gray-200'}
            `}
            aria-label="Toggle Dark Mode"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
        >
            {isDark ? (
                <Moon size={20} className="transition-transform duration-300 hover:rotate-12" />
            ) : (
                <Sun size={20} className="transition-transform duration-300 hover:rotate-90" />
            )}
        </button>
    );
}
