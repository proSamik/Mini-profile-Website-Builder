'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';
import { ThemePackCard } from './theme-pack-card';
import { themePacks } from '@/data/theme-packs';
import { ProfileTheme } from '@/types/profile';
import { Sun, Moon, Palette, Eye, Check } from 'lucide-react';

interface MobileThemeSelectorProps {
  currentTheme?: ProfileTheme;
  onSelect: (theme: ProfileTheme) => void;
  onClose: () => void;
  username: string;
}

export function MobileThemeSelector({
  currentTheme,
  onSelect,
  onClose,
  username,
}: MobileThemeSelectorProps) {
  const [activeTab, setActiveTab] = useState<'themes' | 'preview'>('themes');
  const [previewMode, setPreviewMode] = useState<'light' | 'dark'>(
    currentTheme?.mode === 'dark' ? 'dark' : 'light'
  );
  const [selectedPackId, setSelectedPackId] = useState(
    currentTheme?.packId || 'default'
  );

  const handleApply = () => {
    onSelect({
      packId: selectedPackId,
      mode: previewMode,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="flex-none border-b border-border bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Choose Theme</h2>
          <Button size="sm" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>

        {/* Light/Dark Mode Toggle */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={previewMode === 'light' ? 'primary' : 'outline'}
            onClick={() => setPreviewMode('light')}
            className="flex-1"
          >
            <Sun className="w-4 h-4 mr-1" />
            Light
          </Button>
          <Button
            size="sm"
            variant={previewMode === 'dark' ? 'primary' : 'outline'}
            onClick={() => setPreviewMode('dark')}
            className="flex-1"
          >
            <Moon className="w-4 h-4 mr-1" />
            Dark
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'themes' ? (
          <div className="grid grid-cols-2 gap-3">
            {themePacks.map((pack) => (
              <ThemePackCard
                key={pack.id}
                pack={pack}
                mode={previewMode}
                isSelected={selectedPackId === pack.id}
                onClick={() => setSelectedPackId(pack.id)}
              />
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <iframe
              src={`/${username}`}
              className="w-full h-full border-2 border-border rounded-lg"
              title="Live Preview"
            />
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="flex-none border-t border-border bg-card">
        <div className="grid grid-cols-2 gap-2 p-2">
          <button
            onClick={() => setActiveTab('themes')}
            className={`flex flex-col items-center justify-center py-3 rounded-lg transition-colors ${
              activeTab === 'themes'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <Palette className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Themes</span>
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex flex-col items-center justify-center py-3 rounded-lg transition-colors ${
              activeTab === 'preview'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <Eye className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Preview</span>
          </button>
        </div>

        {/* Apply Button */}
        <div className="p-4 pt-2">
          <Button
            variant="primary"
            onClick={handleApply}
            className="w-full"
          >
            <Check className="w-4 h-4 mr-2" />
            Apply Theme
          </Button>
        </div>
      </div>
    </div>
  );
}
