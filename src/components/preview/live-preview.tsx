'use client';

import { useState } from 'react';
import { ProfileData } from '@/types/profile';
import { ProfileCard } from './profile-card';
import { LinksSection } from './links-section';
import { HighlightsGrid } from './highlights-grid';
import { ThemeApplier } from './theme-applier';
import { Button } from '@/components/ui';
import { Monitor, Smartphone } from 'lucide-react';

interface LivePreviewProps {
  profileData: ProfileData;
}

export function LivePreview({ profileData }: LivePreviewProps) {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Live Preview</h2>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant={viewMode === 'desktop' ? 'primary' : 'outline'}
            onClick={() => setViewMode('desktop')}
          >
            <Monitor className="w-4 h-4 mr-1" />
            Desktop
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'mobile' ? 'primary' : 'outline'}
            onClick={() => setViewMode('mobile')}
          >
            <Smartphone className="w-4 h-4 mr-1" />
            Mobile
          </Button>
        </div>
      </div>

      <ThemeApplier theme={profileData.theme}>
        <div
          className={`transition-all duration-300 mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 ${
            viewMode === 'mobile' ? 'max-w-sm' : 'w-full'
          }`}
        >
          <ProfileCard profileData={profileData} />
          <LinksSection links={profileData.links} />
          <HighlightsGrid highlights={profileData.highlights} />
        </div>
      </ThemeApplier>
    </div>
  );
}
