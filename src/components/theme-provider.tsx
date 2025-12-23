'use client';

import { useEffect } from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize theme on mount
    const savedMode = localStorage.getItem('theme-mode') as 'light' | 'dark' | 'system' | null;
    const root = document.documentElement;

    const applyTheme = (mode: 'light' | 'dark' | 'system') => {
      if (mode === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (systemPrefersDark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      } else if (mode === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    if (savedMode) {
      applyTheme(savedMode);
    } else {
      applyTheme('system');
    }
  }, []);

  return <>{children}</>;
}
