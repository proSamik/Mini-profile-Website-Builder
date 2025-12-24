'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Profile } from '@/lib/db/schema';
import { ProfileData } from '@/types/profile';

export function ProfileMarquee() {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    fetch('/api/profiles/recent')
      .then((res) => res.json())
      .then((data) => setProfiles(data))
      .catch((err) => console.error('Failed to fetch profiles:', err));
  }, []);

  if (profiles.length === 0) return null;

  // Duplicate profiles for seamless infinite scroll only if we have enough profiles
  const displayProfiles = profiles.length >= 3 ? [...profiles, ...profiles] : profiles;

  return (
    <section className="pt-6 pb-12 overflow-hidden">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground">Recently Created Profiles</h2>
        <p className="text-muted-foreground mt-2">Join our growing community</p>
      </div>

      <div className="relative">
        <div className="flex gap-6 animate-marquee">
          {displayProfiles.map((profile, idx) => {
            const data = profile.profileData as ProfileData;
            return (
              <Link
                key={`${profile.id}-${idx}`}
                href={`/${profile.username}`}
                className="flex-shrink-0 w-64"
              >
                <div className="glass-card rounded-2xl p-6 hover:shadow-glow-purple hover:scale-105 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    {data.profilePhoto.type === 'url' ? (
                      <img
                        src={data.profilePhoto.value}
                        alt={data.displayName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-xl">
                        {data.profilePhoto.type === 'placeholder'
                          ? data.profilePhoto.value
                          : data.displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground truncate">{data.displayName}</p>
                      <p className="text-sm text-muted-foreground truncate">@{profile.username}</p>
                    </div>
                  </div>
                  {data.bio && (
                    <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{data.bio}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="text-center mt-8">
        <Link
          href="/profiles"
          className="text-primary hover:text-primary/80 font-semibold inline-flex items-center gap-2 hover:gap-3 transition-all"
        >
          View all profiles
          <span>→</span>
        </Link>
      </div>
    </section>
  );
}
