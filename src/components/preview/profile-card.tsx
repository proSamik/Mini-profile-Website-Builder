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

  // Profile Photo Component
  const ProfilePhoto = ({ size = 'large' }: { size?: 'large' | 'medium' }) => {
    const sizeClasses = size === 'large' ? 'w-32 h-32' : 'w-24 h-24';
    const textSize = size === 'large' ? 'text-4xl' : 'text-3xl';

    return hasPhoto ? (
      <Image
        src={profileData.profilePhoto.value}
        alt={profileData.displayName}
        width={size === 'large' ? 128 : 96}
        height={size === 'large' ? 128 : 96}
        className={`${sizeClasses} rounded-full object-cover shadow-lg border-4 border-primary`}
        onError={() => setImageError(true)}
      />
    ) : (
      <div
        className={`${sizeClasses} rounded-full bg-gradient-to-br ${getGradient()} flex items-center justify-center shadow-lg border-4 border-primary`}
      >
        <span className={`text-white ${textSize} font-bold`}>
          {getInitials(profileData.displayName)}
        </span>
      </div>
    );
  };

  // Default Layout (original vertical centered layout)
  const DefaultLayout = () => (
    <div className="p-8 text-center border-b border-border">
      {/* Profile Photo */}
      <div className="mb-6 flex justify-center">
        <ProfilePhoto size="large" />
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

  // Layout 1: Photo + Username (col1) | Display Name + Bio (col2)
  const Layout1 = () => (
    <div className="p-8 border-b border-border">
      <div className="flex gap-6 items-start">
        {/* Column 1: Photo + Username */}
        <div className="flex flex-col items-center gap-3">
          <ProfilePhoto size="large" />
          <p className="text-sm text-muted-foreground whitespace-nowrap">
            @{profileData.username}
          </p>
        </div>

        {/* Column 2: Display Name + Bio */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="border border-border rounded-lg p-4">
            <h1 className="text-2xl font-bold text-foreground">
              {profileData.displayName}
            </h1>
          </div>
          <div className="border border-border rounded-lg p-4">
            <p className="text-foreground/80 leading-relaxed">
              {profileData.bio}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Layout 2: Display Name + Bio (col1) | Photo + Username (col2)
  const Layout2 = () => (
    <div className="p-8 border-b border-border">
      <div className="flex gap-6 items-start">
        {/* Column 1: Display Name + Bio */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="border border-border rounded-lg p-4">
            <h1 className="text-2xl font-bold text-foreground">
              {profileData.displayName}
            </h1>
          </div>
          <div className="border border-border rounded-lg p-4">
            <p className="text-foreground/80 leading-relaxed">
              {profileData.bio}
            </p>
          </div>
        </div>

        {/* Column 2: Photo + Username */}
        <div className="flex flex-col items-center gap-3">
          <ProfilePhoto size="large" />
          <p className="text-sm text-muted-foreground whitespace-nowrap">
            @{profileData.username}
          </p>
        </div>
      </div>
    </div>
  );

  // Layout 3: Photo (col1) | Display Name + Username (col2, 2 rows) | Bio/Links/Highlights centered
  const Layout3 = () => (
    <div className="p-8 border-b border-border">
      <div className="flex gap-6 items-start mb-6">
        {/* Column 1: Photo */}
        <div className="flex justify-center">
          <ProfilePhoto size="large" />
        </div>

        {/* Column 2: Display Name + Username (split into 2 rows) */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="border border-border rounded-lg p-4">
            <h1 className="text-2xl font-bold text-foreground">
              {profileData.displayName}
            </h1>
          </div>
          <div className="border border-border rounded-lg px-4 py-2">
            <p className="text-sm text-muted-foreground">
              @{profileData.username}
            </p>
          </div>
        </div>
      </div>

      {/* Bio centered */}
      <div className="max-w-md mx-auto">
        <p className="text-foreground/80 leading-relaxed text-center">
          {profileData.bio}
        </p>
      </div>
    </div>
  );

  // Layout 4: Photo + Username stacked (col1) | Display Name + Bio (col2)
  // Note: Highlights and Links order will be handled by parent component
  const Layout4 = () => (
    <div className="p-8 border-b border-border">
      <div className="flex gap-6 items-start">
        {/* Column 1: Photo + Username (stacked in separate rows) */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-center">
            <ProfilePhoto size="large" />
          </div>
          <div className="border border-border rounded-lg px-4 py-2 text-center">
            <p className="text-sm text-muted-foreground">
              @{profileData.username}
            </p>
          </div>
        </div>

        {/* Column 2: Display Name + Bio */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="border border-border rounded-lg p-4">
            <h1 className="text-2xl font-bold text-foreground">
              {profileData.displayName}
            </h1>
          </div>
          <div className="border border-border rounded-lg p-4">
            <p className="text-foreground/80 leading-relaxed">
              {profileData.bio}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Render based on layout preference
  const layout = profileData.layout || 'default';

  switch (layout) {
    case 'layout1':
      return <Layout1 />;
    case 'layout2':
      return <Layout2 />;
    case 'layout3':
      return <Layout3 />;
    case 'layout4':
      return <Layout4 />;
    case 'default':
    default:
      return <DefaultLayout />;
  }
});
