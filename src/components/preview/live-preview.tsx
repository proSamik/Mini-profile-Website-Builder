'use client';

import { useState, useMemo } from 'react';
import { ProfileData } from '@/types/profile';
import { ProfileCard } from './profile-card';
import { LinksSection } from './links-section';
import { HighlightsGrid } from './highlights-grid';
import { Button } from '@/components/ui';
import { Monitor, Smartphone } from 'lucide-react';

interface LivePreviewProps {
  profileData: ProfileData;
}

export function LivePreview({ profileData }: LivePreviewProps) {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  const containerClassName = useMemo(
    () =>
      `mx-auto bg-background rounded-xl shadow-2xl overflow-hidden border border-border ${
        viewMode === 'mobile' ? 'max-w-sm' : 'w-full'
      }`,
    [viewMode]
  );

  const layout = profileData.layout || 'default';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Live Preview</h2>

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

      <div className={containerClassName}>
        <ProfileCard profileData={profileData} />
        {/* Layout 4 renders highlights before links */}
        {layout === 'layout4' ? (
          <>
            <HighlightsGrid highlights={profileData.highlights} forceSingleColumn={viewMode === 'mobile'} />
            <LinksSection links={profileData.links} />
          </>
        ) : (
          <>
            <LinksSection links={profileData.links} />
            <HighlightsGrid highlights={profileData.highlights} forceSingleColumn={viewMode === 'mobile'} />
          </>
        )}
      </div>
    </div>
  );
}
