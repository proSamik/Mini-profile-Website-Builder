import Link from 'next/link';
import { Profile } from '@/lib/db/schema';
import { ProfileData } from '@/types/profile';

interface ProfileCardMiniProps {
  profile: Profile;
}

export function ProfileCardMini({ profile }: ProfileCardMiniProps) {
  const data = profile.profileData as ProfileData;

  return (
    <Link href={`/${profile.username}`}>
      <div className="rounded-2xl p-6 transition-all duration-300 h-full bg-card/80 backdrop-blur-xl border border-border/50 hover:bg-card/90 hover:shadow-glow-purple hover:scale-[1.02]">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
            {data.profilePhoto.type === 'placeholder'
              ? data.profilePhoto.value
              : data.displayName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-foreground truncate">{data.displayName}</h3>
            <p className="text-muted-foreground truncate">@{profile.username}</p>
          </div>
        </div>
        {data.bio && (
          <p className="text-sm text-muted-foreground line-clamp-3">{data.bio}</p>
        )}
      </div>
    </Link>
  );
}
