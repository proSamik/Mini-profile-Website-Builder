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
      className={`relative w-full text-left rounded-lg overflow-hidden transition-all ${
        isSelected
          ? 'ring-2 ring-primary ring-offset-1 ring-offset-background'
          : 'hover:shadow-md border border-transparent hover:border-border'
      }`}
    >
      {/* Gradient Preview Banner */}
      <div
        className="h-12 w-full"
        style={{ background: pack.preview.thumbnail }}
      />

      {/* Theme Preview Content */}
      <div
        className="p-2.5 border border-t-0 border-border"
        style={{ backgroundColor: colors.background }}
      >
        <h3 className="font-bold text-xs text-foreground mb-0.5 leading-tight">{pack.name}</h3>
        <p className="text-[10px] text-muted-foreground mb-1.5 leading-tight line-clamp-1">{pack.description}</p>

        {/* Mini Preview Elements */}
        <div className="space-y-1">
          {/* Card preview */}
          <div
            className="h-5 rounded"
            style={{ backgroundColor: colors.cardBackground }}
          />

          {/* Button preview with gradient */}
          {colors.gradient && (
            <div
              className="h-5 rounded"
              style={{
                background: colors.gradient.via
                  ? `linear-gradient(to right, ${colors.gradient.from}, ${colors.gradient.via}, ${colors.gradient.to})`
                  : `linear-gradient(to right, ${colors.gradient.from}, ${colors.gradient.to})`,
              }}
            />
          )}
        </div>

        {isSelected && (
          <div className="absolute top-1 right-1 bg-primary text-primary-foreground px-1.5 py-0.5 rounded text-[10px] font-medium leading-none">
            Selected
          </div>
        )}
      </div>
    </button>
  );
}
