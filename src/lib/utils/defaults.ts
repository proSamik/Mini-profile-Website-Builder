import { nanoid } from 'nanoid';
import { ProfileData } from '@/types/profile';

export function getDefaultProfileData(): ProfileData {
  return {
    username: 'username',
    displayName: 'Your Name',
    bio: 'Tell us about yourself...',
    profilePhoto: {
      type: 'url',
      value: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256&h=256&fit=crop',
    },
    links: [
      {
        id: nanoid(),
        label: 'GitHub',
        url: 'https://github.com',
        icon: 'github',
        displayOrder: 0,
      },
      {
        id: nanoid(),
        label: 'Twitter',
        url: 'https://twitter.com',
        icon: 'twitter',
        displayOrder: 1,
      },
    ],
    highlights: [
      {
        id: nanoid(),
        title: 'Your First Project',
        description: 'Description of your project',
        images: ['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&q=60'],
        url: 'https://example.com',
        displayOrder: 0,
        category: 'project',
      },
    ],
  };
}
