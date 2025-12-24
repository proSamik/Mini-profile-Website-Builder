'use client';

import { useEffect, useState, useMemo, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Profile } from '@/lib/db/schema';
import { ProfileData } from '@/types/profile';
import { Marquee } from '@/components/ui/marquee';
import { cn } from '@/lib/utils/cn';

const CACHE_KEY = 'marquee_profiles';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Mobile: limit to 4 profiles for background, Desktop: use more
const MOBILE_PROFILE_LIMIT = 4;
const DESKTOP_PROFILE_LIMIT = 12;

function getCachedProfiles(): Profile[] | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();
    
    // Check if cache is still valid
    if (now - timestamp < CACHE_DURATION) {
      return data;
    }
    
    // Cache expired, remove it
    localStorage.removeItem(CACHE_KEY);
    return null;
  } catch {
    return null;
  }
}

function setCachedProfiles(profiles: Profile[]) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data: profiles,
      timestamp: Date.now(),
    }));
  } catch {
    // Ignore localStorage errors
  }
}

// Memoized ProfileCard to prevent unnecessary re-renders
const ProfileCard = memo(({ profile }: { profile: Profile }) => {
  const data = profile.profileData as ProfileData;
  return (
    <Link
      href={`/${profile.username}`}
      className="flex-shrink-0 w-64 pointer-events-auto relative z-20"
      prefetch={false}
    >
      <div className={cn(
        "rounded-2xl p-6 transition-all duration-300",
        "bg-card/80 backdrop-blur-xl border border-border/50",
        "hover:bg-card/90 hover:shadow-glow-purple hover:scale-105",
        "will-change-transform cursor-pointer"
      )}>
        <div className="flex items-center gap-4">
          {data.profilePhoto.type === 'uploaded' || data.profilePhoto.type === 'url' ? (
            <Image
              src={data.profilePhoto.value}
              alt={data.displayName}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover"
              loading="lazy"
              decoding="async"
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
});

ProfileCard.displayName = 'ProfileCard';

export function ProfileMarqueeBackground() {
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    // Load from cache immediately for instant render
    return getCachedProfiles() || [];
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Fetch fresh data in the background
    fetch('/api/profiles/recent', {
      cache: 'force-cache',
    })
      .then((res) => res.json())
      .then((data) => {
        setProfiles(data);
        setCachedProfiles(data);
      })
      .catch((err) => {
        console.error('Failed to fetch profiles:', err);
        // If fetch fails, keep using cached data if available
        const cached = getCachedProfiles();
        if (cached) {
          setProfiles(cached);
        }
      });
  }, []);

  // Use consistent limit - CSS will handle mobile/desktop differences
  const limitedProfiles = useMemo(() => {
    return profiles.slice(0, DESKTOP_PROFILE_LIMIT);
  }, [profiles]);

  // Split profiles into rows for alternating marquee effect
  // Always call hooks in the same order - don't conditionally return before these
  const firstRow = useMemo(
    () => limitedProfiles.slice(0, Math.ceil(limitedProfiles.length / 2)),
    [limitedProfiles]
  );
  const secondRow = useMemo(
    () => limitedProfiles.slice(Math.ceil(limitedProfiles.length / 2)),
    [limitedProfiles]
  );

  // Early return after all hooks
  if (!mounted || limitedProfiles.length === 0) return null;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="relative flex h-full w-full flex-row items-center justify-center gap-4 [perspective:300px] scale-[2]">
        <div
          className="flex flex-row items-center gap-4 will-change-transform"
          style={{
            transform:
              "translateX(-50px) translateY(0px) translateZ(-50px) rotateX(15deg) rotateY(-8deg) rotateZ(10deg)",
          }}
        >
          <Marquee pauseOnHover vertical className="[--duration:20s]" repeat={2}>
            {firstRow.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover vertical className="[--duration:20s]" repeat={2}>
            {secondRow.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </Marquee>
          {/* Hide on mobile using CSS, show on desktop - use contents to not break flex */}
          <div className="hidden md:contents">
            <Marquee pauseOnHover vertical className="[--duration:20s]" repeat={2}>
              {firstRow.map((profile) => (
                <ProfileCard key={`${profile.id}-2`} profile={profile} />
              ))}
            </Marquee>
            <Marquee reverse pauseOnHover vertical className="[--duration:20s]" repeat={2}>
              {secondRow.map((profile) => (
                <ProfileCard key={`${profile.id}-2`} profile={profile} />
              ))}
            </Marquee>
          </div>
        </div>
      </div>

      {/* Gradient overlays for fade effect - with pointer-events-none */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background z-10"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background z-10"></div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-background z-10"></div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background z-10"></div>
    </div>
  );
}
