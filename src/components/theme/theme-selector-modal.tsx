'use client';

import { useState } from 'react';
import { Modal, Button } from '@/components/ui';
import { ThemePackCard } from './theme-pack-card';
import { themePacks } from '@/data/theme-packs';
import { ProfileTheme } from '@/types/profile';
import { Sun, Moon } from 'lucide-react';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme?: ProfileTheme;
  onSelect: (theme: ProfileTheme) => void;
}

export function ThemeSelectorModal({
  isOpen,
  onClose,
  currentTheme,
  onSelect,
}: ThemeSelectorModalProps) {
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Choose Theme Pack"
      size="xl"
    >
      <div className="space-y-3">
        {/* Light/Dark Mode Toggle */}
        <div className="flex items-center justify-between py-2 px-3 bg-muted rounded-lg">
          <span className="font-medium text-sm text-foreground">Preview Mode</span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={previewMode === 'light' ? 'primary' : 'outline'}
              onClick={() => setPreviewMode('light')}
            >
              <Sun className="w-4 h-4 mr-1" />
              Light
            </Button>
            <Button
              size="sm"
              variant={previewMode === 'dark' ? 'primary' : 'outline'}
              onClick={() => setPreviewMode('dark')}
            >
              <Moon className="w-4 h-4 mr-1" />
              Dark
            </Button>
          </div>
        </div>

        {/* Theme Packs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto">
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

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-3 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleApply}>
            Apply Theme
          </Button>
        </div>
      </div>
    </Modal>
  );
}
