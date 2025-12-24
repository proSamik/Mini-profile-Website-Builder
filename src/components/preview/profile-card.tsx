'use client';

import { memo, useState } from 'react';
import Image from 'next/image';
import { ProfileData } from '@/types/profile';

interface ProfileCardProps {
  profileData: ProfileData;
}

export const ProfileCard = memo(function ProfileCard({ profileData }: ProfileCardProps) {
  const [imageError, setImageError] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getGradient = () => {
    const gradients = [
      'from-purple-400 via-pink-500 to-red-500',
      'from-blue-400 via-cyan-500 to-teal-500',
      'from-orange-400 via-red-500 to-pink-500',
      'from-green-400 via-emerald-500 to-cyan-500',
      'from-indigo-400 via-purple-500 to-pink-500',
      'from-yellow-400 via-orange-500 to-red-500',
    ];
    const index = profileData.displayName.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  const hasPhoto = profileData.profilePhoto.value && profileData.profilePhoto.type !== 'placeholder' && !imageError;

  return (
    <div className="p-8 text-center border-b border-border">
      {/* Profile Photo */}
      <div className="mb-6">
        {hasPhoto ? (
          <Image
            src={profileData.profilePhoto.value}
            alt={profileData.displayName}
            width={128}
            height={128}
            className="w-32 h-32 rounded-full mx-auto object-cover shadow-lg border-4 border-primary"
            onError={() => setImageError(true)}
          />
        ) : (
          <div
            className={`w-32 h-32 rounded-full mx-auto bg-gradient-to-br ${getGradient()} flex items-center justify-center shadow-lg border-4 border-primary`}
          >
            <span className="text-white text-4xl font-bold">
              {getInitials(profileData.displayName)}
            </span>
          </div>
        )}
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
});
