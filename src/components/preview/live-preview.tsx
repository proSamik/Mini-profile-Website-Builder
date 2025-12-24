'use client';

import { useState, useMemo } from 'react';
import { ProfileData } from '@/types/profile';
import { ProfileCard } from './profile-card';
import { LinksSection } from './links-section';
import { HighlightsGrid } from './highlights-grid';
import { Button, Iphone } from '@/components/ui';
import { Monitor, Smartphone, ExternalLink } from 'lucide-react';
import { ThemedProfileWrapper } from '@/components/theme/themed-profile-wrapper';

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

      <ThemedProfileWrapper theme={profileData.theme} className="min-h-full">
        {viewMode === 'mobile' ? (
          /* Mobile view with iPhone bezel */
          <div className="flex justify-center">
            <Iphone>
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
            </Iphone>
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
      </ThemedProfileWrapper>
    </div>
  );
}
