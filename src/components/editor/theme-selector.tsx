'use client';

import { useState, useEffect } from 'react';
import { ProfileData, ProfileTheme } from '@/types/profile';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { ThemeSelectorModal } from '@/components/theme/theme-selector-modal';
import { MobileThemeSelector } from '@/components/theme/mobile-theme-selector';
import { getThemePack } from '@/data/theme-packs';
import { Palette } from 'lucide-react';

interface ThemeSelectorProps {
  profileData: ProfileData;
  onChange: (updates: Partial<ProfileData>) => void;
}

export function ThemeSelector({ profileData, onChange }: ThemeSelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const currentTheme = profileData.theme || { packId: 'default', mode: 'light' };
  const themePack = getThemePack(currentTheme.packId);

  const handleThemeSelect = (theme: ProfileTheme) => {
    onChange({ theme });
  };

  const handleOpenSelector = () => {
    if (isMobile) {
      setIsMobileView(true);
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Theme Pack</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Current Theme Display */}
            <div
              className="p-4 rounded-lg border-2 border-border"
              style={{
                background: themePack?.preview.thumbnail || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              <div className="text-white">
                <h3 className="font-bold text-lg">{themePack?.name || 'Default'}</h3>
                <p className="text-sm opacity-90">{themePack?.description || 'Clean and simple'}</p>
                <p className="text-xs mt-2 opacity-75">Mode: {currentTheme.mode}</p>
              </div>
            </div>

            {/* Change Theme Button */}
            <Button
              variant="outline"
              onClick={handleOpenSelector}
              className="w-full"
            >
              <Palette className="w-4 h-4 mr-2" />
              Choose Theme Pack
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Desktop Modal */}
      {!isMobile && (
        <ThemeSelectorModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          currentTheme={currentTheme}
          onSelect={handleThemeSelect}
        />
      )}

      {/* Mobile Full Screen View */}
      {isMobile && isMobileView && (
        <MobileThemeSelector
          currentTheme={currentTheme}
          onSelect={handleThemeSelect}
          onClose={() => setIsMobileView(false)}
          username={profileData.username}
        />
      )}
    </>
  );
}
