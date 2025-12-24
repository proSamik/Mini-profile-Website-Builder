'use client';

import { useState, useMemo } from 'react';
import { ProfileData } from '@/types/profile';
import { ProfileCard } from './profile-card';
import { LinksSection } from './links-section';
import { HighlightsGrid } from './highlights-grid';
import { Button } from '@/components/ui';
import { Monitor, Smartphone, ExternalLink } from 'lucide-react';

interface LivePreviewProps {
  profileData: ProfileData;
}

export function LivePreview({ profileData }: LivePreviewProps) {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  const containerClassName = useMemo(
    () =>
      viewMode === 'mobile'
        ? 'mx-auto bg-background rounded-xl shadow-2xl overflow-hidden border border-border max-w-sm'
        : 'w-full bg-background rounded-xl shadow-2xl overflow-hidden border border-border',
    [viewMode]
  );

  const layout = profileData.layout || 'default';

  const handleOpenInNewTab = () => {
    window.open(`/${profileData.username}`, '_blank');
  };

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
          <Button
            size="sm"
            variant="outline"
            onClick={handleOpenInNewTab}
            title="Open profile in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {viewMode === 'mobile' ? (
        /* Mobile view with bezel */
        <div className="mx-auto" style={{ width: '375px' }}>
          {/* Mobile device bezel */}
          <div className="bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
            {/* Notch */}
            <div className="bg-black h-6 rounded-t-[2.5rem] relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gray-900 w-32 h-6 rounded-b-2xl" />
            </div>
            {/* Screen */}
            <div className="bg-background rounded-b-[2rem] overflow-hidden" style={{ height: '667px' }}>
              <div className="h-full overflow-y-auto">
                <ProfileCard profileData={profileData} />
                {/* Layout 4 renders highlights before links */}
                {layout === 'layout4' ? (
                  <>
                    <HighlightsGrid highlights={profileData.highlights} forceSingleColumn={true} />
                    <LinksSection links={profileData.links} />
                  </>
                ) : (
                  <>
                    <LinksSection links={profileData.links} />
                    <HighlightsGrid highlights={profileData.highlights} forceSingleColumn={true} />
                  </>
                )}
              </div>
            </div>
            {/* Bottom indicator */}
            <div className="h-1 mt-2 bg-gray-700 w-32 mx-auto rounded-full" />
          </div>
        </div>
      ) : (
        /* Desktop view */
        <div className={containerClassName}>
          <ProfileCard profileData={profileData} />
          {/* Layout 4 renders highlights before links */}
          {layout === 'layout4' ? (
            <>
              <HighlightsGrid highlights={profileData.highlights} forceSingleColumn={false} />
              <LinksSection links={profileData.links} />
            </>
          ) : (
            <>
              <LinksSection links={profileData.links} />
              <HighlightsGrid highlights={profileData.highlights} forceSingleColumn={false} />
            </>
          )}
        </div>
      )}
    </div>
  );
}
