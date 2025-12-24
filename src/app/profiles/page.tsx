import Link from 'next/link';
import { getRecentProfiles } from '@/lib/db/queries';
import { ProfileCardMini } from '@/components/profiles/profile-card-mini';
import { Button } from '@/components/ui/button';

export default async function ProfilesPage() {
  const profiles = await getRecentProfiles(100);

  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Explore Profiles
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Discover amazing people and their stories
          </p>
          <Link href="/">
            <Button variant="gradient">Create Your Profile</Button>
          </Link>
        </div>

        {profiles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">
              No profiles yet. Be the first to create one!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {profiles.map((profile) => (
              <ProfileCardMini key={profile.id} profile={profile} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
