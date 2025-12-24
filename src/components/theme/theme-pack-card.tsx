'use client';

import { ThemePack } from '@/types/theme';

interface ThemePackCardProps {
  pack: ThemePack;
  mode: 'light' | 'dark';
  isSelected?: boolean;
  onClick?: () => void;
}

export function ThemePackCard({ pack, mode, isSelected, onClick }: ThemePackCardProps) {
  const colors = mode === 'light' ? pack.light : pack.dark;

  return (
    <button
      onClick={onClick}
      className={`relative w-full text-left rounded-xl overflow-hidden transition-all ${
        isSelected
          ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-105'
          : 'hover:scale-102 hover:shadow-lg'
      }`}
    >
      {/* Gradient Preview Banner */}
      <div
        className="h-24 w-full"
        style={{ background: pack.preview.thumbnail }}
      />

      {/* Theme Preview Content */}
      <div
        className="p-4 border-2 border-t-0 border-border"
        style={{ backgroundColor: colors.background }}
      >
        <h3 className="font-bold text-foreground mb-1">{pack.name}</h3>
        <p className="text-sm text-muted-foreground mb-3">{pack.description}</p>

        {/* Mini Preview Elements */}
        <div className="space-y-2">
          {/* Card preview */}
          <div
            className="h-8 rounded-lg"
            style={{ backgroundColor: colors.cardBackground }}
          />

          {/* Button preview with gradient */}
          {colors.gradient && (
            <div
              className="h-8 rounded-lg"
              style={{
                background: colors.gradient.via
                  ? `linear-gradient(to right, ${colors.gradient.from}, ${colors.gradient.via}, ${colors.gradient.to})`
                  : `linear-gradient(to right, ${colors.gradient.from}, ${colors.gradient.to})`,
              }}
            />
          )}
        </div>

        {isSelected && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-medium">
            Selected
          </div>
        )}
      </div>
    </button>
  );
}
