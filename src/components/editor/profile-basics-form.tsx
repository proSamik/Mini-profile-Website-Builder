'use client';

import { useState, useEffect } from 'react';
import { ProfileData } from '@/types/profile';
import { Card, CardHeader, CardTitle, CardContent, Input, Textarea } from '@/components/ui';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface ProfileBasicsFormProps {
  profileData: ProfileData;
  onChange: (updates: Partial<ProfileData>) => void;
  userId: string;
  onUsernameValidChange?: (isValid: boolean) => void;
}

export function ProfileBasicsForm({ profileData, onChange, userId, onUsernameValidChange }: ProfileBasicsFormProps) {
  const [checking, setChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(true);
  const [originalUsername] = useState(profileData.username);

  useEffect(() => {
    const username = profileData.username.toLowerCase().replace(/[^a-z0-9]/g, '');

    if (username !== profileData.username) {
      onChange({ username });
      return;
    }

    if (username.length < 3) {
      setUsernameAvailable(false);
      onUsernameValidChange?.(false);
      return;
    }

    // If username hasn't changed, it's valid
    if (username === originalUsername) {
      setUsernameAvailable(true);
      onUsernameValidChange?.(true);
      return;
    }

    const timeout = setTimeout(async () => {
      setChecking(true);
      try {
        const res = await fetch(
          `/api/profiles/check-username?username=${encodeURIComponent(username)}&excludeUserId=${encodeURIComponent(userId)}`
        );
        const data = await res.json();
        setUsernameAvailable(data.available);
        onUsernameValidChange?.(data.available);
      } catch (error) {
        console.error('Error checking username:', error);
        setUsernameAvailable(false);
        onUsernameValidChange?.(false);
      } finally {
        setChecking(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [profileData.username, originalUsername, onChange, onUsernameValidChange, userId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Info</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Input
            label="Username (letters and numbers only)"
            value={profileData.username}
            onChange={(e) => onChange({ username: e.target.value.toLowerCase() })}
            placeholder="username"
            error={usernameAvailable === false && profileData.username.length >= 3 ? 'Username is already taken' : undefined}
          />
          <div className="absolute right-3 top-[44px]">
            {checking && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />}
            {!checking && usernameAvailable === true && profileData.username.length >= 3 && (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            )}
            {!checking && usernameAvailable === false && profileData.username.length >= 3 && (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
          </div>
        </div>

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
