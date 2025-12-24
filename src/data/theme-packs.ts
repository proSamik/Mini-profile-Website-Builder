import { ThemePack } from '@/types/theme';

export const themePacks: ThemePack[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Clean and simple',
    light: {
      background: '#ffffff',
      cardBackground: '#f8f9fa',
    },
    dark: {
      background: '#0a0a0b',
      cardBackground: '#18181b',
    },
    preview: {
      thumbnail: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean Breeze',
    description: 'Cool and calming blues',
    light: {
      background: '#e0f7ff',
      cardBackground: '#ffffff',
      gradient: {
        from: '#06b6d4',
        to: '#3b82f6',
      },
      border: '#06b6d4',
      accent: '#0ea5e9',
    },
    dark: {
      background: '#0c1e2e',
      cardBackground: '#1a2f42',
      gradient: {
        from: '#06b6d4',
        to: '#3b82f6',
      },
      border: '#06b6d4',
      accent: '#0ea5e9',
    },
    preview: {
      thumbnail: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset Glow',
    description: 'Warm sunset vibes',
    light: {
      background: '#fff5f0',
      cardBackground: '#ffffff',
      gradient: {
        from: '#f97316',
        via: '#f59e0b',
        to: '#ef4444',
      },
      border: '#f97316',
      accent: '#fb923c',
    },
    dark: {
      background: '#1a0f0a',
      cardBackground: '#2d1810',
      gradient: {
        from: '#f97316',
        via: '#f59e0b',
        to: '#ef4444',
      },
      border: '#f97316',
      accent: '#fb923c',
    },
    preview: {
      thumbnail: 'linear-gradient(135deg, #f97316 0%, #f59e0b 50%, #ef4444 100%)',
    },
  },
  {
    id: 'forest',
    name: 'Forest Green',
    description: 'Natural and earthy',
    light: {
      background: '#f0fdf4',
      cardBackground: '#ffffff',
      gradient: {
        from: '#10b981',
        to: '#059669',
      },
      border: '#10b981',
      accent: '#34d399',
    },
    dark: {
      background: '#0a1f14',
      cardBackground: '#163020',
      gradient: {
        from: '#10b981',
        to: '#059669',
      },
      border: '#10b981',
      accent: '#34d399',
    },
    preview: {
      thumbnail: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    },
  },
  {
    id: 'lavender',
    name: 'Lavender Dream',
    description: 'Soft and elegant purple',
    light: {
      background: '#faf5ff',
      cardBackground: '#ffffff',
      gradient: {
        from: '#a855f7',
        to: '#ec4899',
      },
      border: '#a855f7',
      accent: '#c084fc',
    },
    dark: {
      background: '#1a0f1f',
      cardBackground: '#2d1b33',
      gradient: {
        from: '#a855f7',
        to: '#ec4899',
      },
      border: '#a855f7',
      accent: '#c084fc',
    },
    preview: {
      thumbnail: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight Blue',
    description: 'Deep and mysterious',
    light: {
      background: '#eff6ff',
      cardBackground: '#ffffff',
      gradient: {
        from: '#1e40af',
        to: '#7c3aed',
      },
      border: '#1e40af',
      accent: '#3b82f6',
    },
    dark: {
      background: '#0f172a',
      cardBackground: '#1e293b',
      gradient: {
        from: '#1e40af',
        to: '#7c3aed',
      },
      border: '#1e40af',
      accent: '#3b82f6',
    },
    preview: {
      thumbnail: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
    },
  },
  {
    id: 'candy',
    name: 'Candy Pop',
    description: 'Sweet and vibrant',
    light: {
      background: '#fff1f8',
      cardBackground: '#ffffff',
      gradient: {
        from: '#ec4899',
        via: '#f472b6',
        to: '#fb7185',
      },
      border: '#ec4899',
      accent: '#f472b6',
    },
    dark: {
      background: '#1f0a14',
      cardBackground: '#331525',
      gradient: {
        from: '#ec4899',
        via: '#f472b6',
        to: '#fb7185',
      },
      border: '#ec4899',
      accent: '#f472b6',
    },
    preview: {
      thumbnail: 'linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #fb7185 100%)',
    },
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    description: 'Classic black and white',
    light: {
      background: '#ffffff',
      cardBackground: '#f5f5f5',
      gradient: {
        from: '#000000',
        to: '#374151',
      },
      border: '#000000',
      accent: '#1f2937',
    },
    dark: {
      background: '#000000',
      cardBackground: '#0f0f0f',
      gradient: {
        from: '#ffffff',
        to: '#9ca3af',
      },
      border: '#ffffff',
      accent: '#d1d5db',
    },
    preview: {
      thumbnail: 'linear-gradient(135deg, #000000 0%, #374151 100%)',
    },
  },
];

export const getThemePack = (id: string): ThemePack | undefined => {
  return themePacks.find((pack) => pack.id === id);
};

export const getDefaultTheme = (): ThemePack => {
  return themePacks[0];
};
