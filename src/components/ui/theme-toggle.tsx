'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = (localStorage.getItem('theme') as Theme) || 'system';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    
    // Always remove first to ensure clean state
    root.classList.remove('dark', 'light');
    
    if (newTheme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(systemPrefersDark ? 'dark' : 'light');
    } else if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.add('light');
    }
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => applyTheme('system');
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  if (!mounted) {
    return (
      <div className="flex gap-1 p-1 bg-muted rounded-lg">
        <div className="w-8 h-8" />
      </div>
    );
  }

  const buttons: Array<{ theme: Theme; icon: typeof Sun; label: string }> = [
    { theme: 'light', icon: Sun, label: 'Light' },
    { theme: 'dark', icon: Moon, label: 'Dark' },
    { theme: 'system', icon: Monitor, label: 'System' },
  ];

  return (
    <div className="flex gap-1 p-1 bg-muted rounded-lg">
      {buttons.map(({ theme: buttonTheme, icon: Icon, label }) => (
        <button
          key={buttonTheme}
          onClick={() => handleThemeChange(buttonTheme)}
          className={`p-2 rounded-md transition-colors ${
            theme === buttonTheme
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          title={label}
          aria-label={label}
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
}
