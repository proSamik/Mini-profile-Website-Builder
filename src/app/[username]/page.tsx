import { notFound } from 'next/navigation';
import { getProfileByUsername } from '@/lib/db/queries';
import { ProfileCard } from '@/components/preview/profile-card';
import { LinksSection } from '@/components/preview/links-section';
import { HighlightsGrid } from '@/components/preview/highlights-grid';
import { ThemeApplier } from '@/components/preview/theme-applier';
import { ProfileData } from '@/types/profile';

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params;

  const profile = await getProfileByUsername(username);

  if (!profile) {
    notFound();
  }

  const profileData = profile.profileData as ProfileData;

  return (
    <ThemeApplier theme={profileData.theme}>
      <div className="min-h-screen bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <ProfileCard profileData={profileData} />
          <LinksSection links={profileData.links} />
          <HighlightsGrid highlights={profileData.highlights} />
        </div>
      </div>
    </ThemeApplier>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { username } = await params;
  const profile = await getProfileByUsername(username);

  if (!profile) {
    return {
      title: 'Profile Not Found',
    };
  }

  const profileData = profile.profileData as ProfileData;

  return {
    title: `${profileData.displayName} (@${profileData.username})`,
    description: profileData.bio,
  };
}
