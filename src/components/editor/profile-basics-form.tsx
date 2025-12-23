'use client';

import { ProfileData } from '@/types/profile';
import { Card, CardHeader, CardTitle, CardContent, Input, Textarea } from '@/components/ui';

interface ProfileBasicsFormProps {
  profileData: ProfileData;
  onChange: (updates: Partial<ProfileData>) => void;
}

export function ProfileBasicsForm({ profileData, onChange }: ProfileBasicsFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Info</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          label="Username"
          value={profileData.username}
          onChange={(e) => onChange({ username: e.target.value })}
          placeholder="username"
        />

        <Input
          label="Display Name"
          value={profileData.displayName}
          onChange={(e) => onChange({ displayName: e.target.value })}
          placeholder="Your Name"
        />

        <Textarea
          label={`Bio (${profileData.bio.length}/160)`}
          value={profileData.bio}
          onChange={(e) => onChange({ bio: e.target.value })}
          placeholder="Tell us about yourself..."
          maxLength={160}
          rows={3}
        />
      </CardContent>
    </Card>
  );
}
