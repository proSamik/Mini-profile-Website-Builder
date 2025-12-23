'use client';

import { ProfileData } from '@/types/profile';

interface ProfileCardProps {
  profileData: ProfileData;
}

export function ProfileCard({ profileData }: ProfileCardProps) {
  return (
    <div className="p-8 text-center border-b border-border">
      {/* Profile Photo */}
      <div className="mb-6">
        <img
          src={profileData.profilePhoto.value}
          alt={profileData.displayName}
          className="w-32 h-32 rounded-full mx-auto object-cover shadow-lg border-4 border-primary"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/128';
          }}
        />
      </div>

      {/* Display Name */}
      <h1 className="text-3xl font-bold text-foreground mb-1">
        {profileData.displayName}
      </h1>

      {/* Username */}
      <p className="text-muted-foreground mb-4">
        @{profileData.username}
      </p>

      {/* Bio */}
      <p className="text-foreground/80 max-w-md mx-auto leading-relaxed">
        {profileData.bio}
      </p>
    </div>
  );
}
