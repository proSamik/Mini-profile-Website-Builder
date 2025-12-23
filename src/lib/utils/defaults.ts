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
    theme: {
      layout: 'centered',
      colorScheme: 'light',
      primaryColor: '#000000',
      secondaryColor: '#FFFFFF',
      accentColor: '#374151',
    },
    links: [
      {
        id: nanoid(),
        label: 'GitHub',
        url: 'https://github.com',
        icon: 'github',
        displayOrder: 1,
      },
      {
        id: nanoid(),
        label: 'Twitter',
        url: 'https://twitter.com',
        icon: 'twitter',
        displayOrder: 2,
      },
    ],
    highlights: [
      {
        id: nanoid(),
        title: 'Your First Project',
        description: 'Description of your project',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&q=60',
        url: 'https://example.com',
        displayOrder: 1,
        category: 'project',
      },
    ],
  };
}
