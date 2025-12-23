'use client';

import { ProfileData } from '@/types/profile';
import { ProfileBasicsForm } from './profile-basics-form';
import { PhotoUploader } from './photo-uploader';
import { LinksManager } from './links-manager';
import { HighlightsManager } from './highlights-manager';

interface UIEditorProps {
  profileData: ProfileData;
  onChange: (updates: Partial<ProfileData>) => void;
  userId: string;
}

export function UIEditor({ profileData, onChange, userId }: UIEditorProps) {
  return (
    <div className="space-y-6">
      <ProfileBasicsForm profileData={profileData} onChange={onChange} />
      <PhotoUploader profileData={profileData} onChange={onChange} userId={userId} />
      <LinksManager profileData={profileData} onChange={onChange} />
      <HighlightsManager profileData={profileData} onChange={onChange} userId={userId} />
    </div>
  );
}
