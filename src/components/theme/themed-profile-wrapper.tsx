'use client';

import { ReactNode, useMemo, useState, useEffect } from 'react';
import { ProfileTheme } from '@/types/profile';
import { getThemePack } from '@/data/theme-packs';

interface ThemedProfileWrapperProps {
  theme?: ProfileTheme;
  children: ReactNode;
  className?: string;
}

// Helper to determine if a color is dark
function isDarkColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
}

export function ThemedProfileWrapper({ theme, children, className = '' }: ThemedProfileWrapperProps) {
  const [systemPrefersDark, setSystemPrefersDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Detect system preference for 'auto' mode
  useEffect(() => {
    setMounted(true);
    if (theme?.mode === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setSystemPrefersDark(mediaQuery.matches);

      const handler = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [theme?.mode]);

  const { colors, textColor, cardTextColor, isDarkMode } = useMemo(() => {
    if (!theme) {
      return { colors: null, textColor: null, cardTextColor: null, isDarkMode: false };
    }

    const pack = getThemePack(theme.packId);
    if (!pack) {
      return { colors: null, textColor: null, cardTextColor: null, isDarkMode: false };
    }

    // Determine actual mode (handle 'auto' by checking system preference)
    // Default to light on server-side to avoid hydration mismatch
    let actualMode: 'light' | 'dark' = theme.mode === 'auto' 
      ? (mounted && systemPrefersDark ? 'dark' : 'light')
      : theme.mode === 'dark' ? 'dark' : 'light';

    const colors = actualMode === 'dark' ? pack.dark : pack.light;
    const isDarkMode = actualMode === 'dark';
    
    // Determine text color based on background
    const bgColor = colors.background;
    const cardBgColor = colors.cardBackground;
    const textColor = isDarkColor(bgColor) ? '#ffffff' : '#000000';
    const cardTextColor = isDarkColor(cardBgColor) ? '#ffffff' : '#000000';

    return { colors, textColor, cardTextColor, isDarkMode };
  }, [theme, mounted, systemPrefersDark]);

  if (!colors) {
    return <div className={className}>{children}</div>;
  }

  // Build style object
  const style: React.CSSProperties = {
    backgroundColor: colors.background,
    color: textColor || (isDarkMode ? '#ffffff' : '#000000'),
  };

  // Build CSS for cards, links, etc.
  const cssVars = {
    '--theme-card-bg': colors.cardBackground,
    '--theme-card-text': textColor || (isDarkColor(colors.cardBackground) ? '#ffffff' : '#000000'),
    '--theme-gradient-from': colors.gradient?.from || '#667eea',
    '--theme-gradient-via': colors.gradient?.via || '',
    '--theme-gradient-to': colors.gradient?.to || '#764ba2',
    '--theme-border': colors.border || (isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'),
    '--theme-accent': colors.accent || colors.gradient?.from || '#667eea',
  } as React.CSSProperties;

  const gradientStyle = colors.gradient?.via
    ? `linear-gradient(135deg, var(--theme-gradient-from), var(--theme-gradient-via), var(--theme-gradient-to))`
    : `linear-gradient(135deg, var(--theme-gradient-from), var(--theme-gradient-to))`;

  return (
    <div
      className={className}
      style={{ ...style, ...cssVars }}
    >
      <style jsx global>{`
        /* Theme-specific styles */
        .themed-card {
          background-color: var(--theme-card-bg) !important;
          color: var(--theme-card-text) !important;
        }

        .themed-card h1,
        .themed-card h2,
        .themed-card h3,
        .themed-card p {
          color: var(--theme-card-text) !important;
        }

        .themed-gradient {
          background: ${gradientStyle} !important;
        }

        .themed-border {
          border-color: var(--theme-border) !important;
        }

        .themed-link {
          background: ${gradientStyle} !important;
          color: white !important;
          border: none !important;
        }

        .themed-link:hover {
          opacity: 0.9 !important;
          transform: scale(1.05) !important;
        }
      `}</style>
      {children}
    </div>
  );
}
