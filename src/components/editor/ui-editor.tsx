'use client';

import { useState } from 'react';
import { ProfileData } from '@/types/profile';
import { ProfileBasicsForm } from './profile-basics-form';
import { PhotoUploader } from './photo-uploader';
import { LinksManager } from './links-manager';
import { HighlightsManager } from './highlights-manager';
import { LayoutSelector } from './layout-selector';

interface UIEditorProps {
  profileData: ProfileData;
  onChange: (updates: Partial<ProfileData>) => void;
  userId: string;
  onUsernameValidChange?: (isValid: boolean) => void;
}

export function UIEditor({ profileData, onChange, userId, onUsernameValidChange }: UIEditorProps) {
  return (
    <div className="space-y-6">
      <ProfileBasicsForm
        profileData={profileData}
        onChange={onChange}
        userId={userId}
        onUsernameValidChange={onUsernameValidChange}
      />
      <PhotoUploader profileData={profileData} onChange={onChange} userId={userId} />
      <LinksManager profileData={profileData} onChange={onChange} />
      <HighlightsManager profileData={profileData} onChange={onChange} userId={userId} />
      <LayoutSelector profileData={profileData} onChange={onChange} />
    </div>
  );
}
