'use client';

import { useState } from 'react';
import { ProfileData } from '@/types/profile';
import { ProfileInfoCard } from './profile-info-card';
import { LinksManager } from './links-manager';
import { HighlightsManager } from './highlights-manager';
import { LayoutSelector } from './layout-selector';
import { ThemeSelector } from './theme-selector';

interface UIEditorProps {
  profileData: ProfileData;
  onChange: (updates: Partial<ProfileData>) => void;
  userId: string;
  onUsernameValidChange?: (isValid: boolean) => void;
}

export function UIEditor({ profileData, onChange, userId, onUsernameValidChange }: UIEditorProps) {
  return (
    <div className="space-y-6">
      <ProfileInfoCard
        profileData={profileData}
        onChange={onChange}
        userId={userId}
        onUsernameValidChange={onUsernameValidChange}
      />
      <LinksManager profileData={profileData} onChange={onChange} />
      <HighlightsManager profileData={profileData} onChange={onChange} userId={userId} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LayoutSelector profileData={profileData} onChange={onChange} />
        <ThemeSelector profileData={profileData} onChange={onChange} />
      </div>
    </div>
  );
}
