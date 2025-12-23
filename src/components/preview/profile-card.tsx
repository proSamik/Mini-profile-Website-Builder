'use client';

import { ProfileData } from '@/types/profile';

interface ProfileCardProps {
  profileData: ProfileData;
}

export function ProfileCard({ profileData }: ProfileCardProps) {
  return (
    <div className="p-8 text-center border-b border-gray-200 dark:border-gray-700">
      {/* Profile Photo */}
      <div className="mb-6">
        <img
          src={profileData.profilePhoto.value}
          alt={profileData.displayName}
          className="w-32 h-32 rounded-full mx-auto object-cover shadow-lg"
          style={{
            borderWidth: '4px',
            borderColor: 'var(--primary-color, #3B82F6)',
          }}
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/128';
          }}
        />
      </div>

      {/* Display Name */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
        {profileData.displayName}
      </h1>

      {/* Username */}
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        @{profileData.username}
      </p>

      {/* Bio */}
      <p className="text-gray-700 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
        {profileData.bio}
      </p>
    </div>
  );
}
