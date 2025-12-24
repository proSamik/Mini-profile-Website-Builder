'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Profile } from '@/lib/db/schema';
import { ProfileData } from '@/types/profile';
import { Marquee } from '@/components/ui/marquee';
import { cn } from '@/lib/utils/cn';

export function ProfileMarquee() {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    fetch('/api/profiles/recent')
      .then((res) => res.json())
      .then((data) => setProfiles(data))
      .catch((err) => console.error('Failed to fetch profiles:', err));
  }, []);

  if (profiles.length === 0) return null;

  // Split profiles into two rows for alternating marquee effect
  const firstRow = profiles.slice(0, Math.ceil(profiles.length / 2));
  const secondRow = profiles.slice(Math.ceil(profiles.length / 2));

  const ProfileCard = ({ profile }: { profile: Profile }) => {
    const data = profile.profileData as ProfileData;
    return (
      <Link
        href={`/${profile.username}`}
        className="flex-shrink-0 w-64"
      >
        <div className={cn(
          "glass-card rounded-2xl p-6 hover:shadow-glow-purple hover:scale-105 transition-all duration-300"
        )}>
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
  };

  return (
    <section className="pt-6 pb-12 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground">Recently Created Profiles</h2>
          <p className="text-muted-foreground mt-2">Join our growing community</p>
        </div>

        <div className="relative flex h-96 w-full flex-row items-center justify-center gap-4 overflow-hidden [perspective:300px]">
          <div
            className="flex flex-row items-center gap-4"
            style={{
              transform:
                "translateX(-50px) translateY(0px) translateZ(-50px) rotateX(15deg) rotateY(-8deg) rotateZ(10deg)",
            }}
          >
            <Marquee pauseOnHover vertical className="[--duration:20s]">
              {firstRow.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </Marquee>
            <Marquee reverse pauseOnHover vertical className="[--duration:20s]">
              {secondRow.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </Marquee>
            <Marquee pauseOnHover vertical className="[--duration:20s]">
              {firstRow.map((profile) => (
                <ProfileCard key={`${profile.id}-2`} profile={profile} />
              ))}
            </Marquee>
            <Marquee reverse pauseOnHover vertical className="[--duration:20s]">
              {secondRow.map((profile) => (
                <ProfileCard key={`${profile.id}-2`} profile={profile} />
              ))}
            </Marquee>
          </div>

          {/* Gradient overlays for fade effect */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background"></div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
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
      </div>
    </section>
  );
}
