export interface ThemeColors {
  // Background colors
  background: string;
  cardBackground: string;

  // Gradient options (for links, buttons, etc.)
  gradient?: {
    from: string;
    via?: string;
    to: string;
  };

  // Font family
  fontFamily?: string;

  // Border and accent
  border?: string;
  accent?: string;
}

export interface ThemePack {
  id: string;
  name: string;
  description: string;
  light: ThemeColors;
  dark: ThemeColors;
  preview: {
    thumbnail: string; // Gradient preview
  };
}

export interface ProfileTheme {
  packId: string;
  mode: 'light' | 'dark' | 'auto';
  customColors?: Partial<ThemeColors>;
}
