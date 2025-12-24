'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Edit, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EditButtonProps {
  username: string;
}

export function EditButton({ username }: EditButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleClick = () => {
    if (session?.user) {
      router.push('/editor');
    } else {
      router.push('/?login=' + username);
    }
  };

  // Only show if user is logged in and viewing their own profile
  const isOwnProfile = session?.user?.username === username;

  if (!isOwnProfile && !session?.user) {
    // Not logged in and not their profile - don't show button
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        onClick={handleClick}
        variant="glass"
        size="md"
        className="shadow-lg"
      >
        {isOwnProfile ? (
          <>
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </>
        ) : (
          <>
            <LogIn className="w-4 h-4 mr-2" />
            Login
          </>
        )}
      </Button>
    </div>
  );
}
