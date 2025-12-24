export interface ProfilePhoto {
  type: 'url' | 'placeholder' | 'uploaded';
  value: string;
}

export interface Link {
  id: string;
  label: string;
  url: string;
  icon: string;
  displayOrder: number;
  favicon?: string;
}

export interface Highlight {
  id: string;
  title: string;
  description?: string;
  images?: string[];
  url?: string;
  displayOrder: number;
  category?: string;
}

export type ProfileLayout = 'default' | 'layout1' | 'layout2' | 'layout3' | 'layout4';

export interface ProfileTheme {
  packId: string;
  mode: 'light' | 'dark' | 'auto';
}

export interface ProfileData {
  username: string;
  displayName: string;
  bio: string;
  profilePhoto: ProfilePhoto;
  links: Link[];
  highlights: Highlight[];
  layout?: ProfileLayout; // Profile layout preference (defaults to 'default')
  theme?: ProfileTheme; // Theme preference (defaults to default theme)
}

export interface ProfileResponse {
  id: string;
  userId: string;
  username: string;
  profileData: ProfileData;
  createdAt: Date;
  updatedAt: Date;
}
