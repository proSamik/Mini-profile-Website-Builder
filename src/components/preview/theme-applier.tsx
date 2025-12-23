'use client';

import { Theme } from '@/types/profile';
import { ReactNode } from 'react';

interface ThemeApplierProps {
  theme: Theme;
  children: ReactNode;
}

export function ThemeApplier({ theme, children }: ThemeApplierProps) {
  const cssVars = {
    '--primary-color': theme.primaryColor,
    '--secondary-color': theme.secondaryColor,
    '--accent-color': theme.accentColor,
  } as React.CSSProperties;

  const isDark = theme.colorScheme === 'dark';

  return (
    <div
      style={cssVars}
      className={isDark ? 'dark' : ''}
    >
      {children}
    </div>
  );
}
