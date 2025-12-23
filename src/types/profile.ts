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
}

export interface Highlight {
  id: string;
  title: string;
  description?: string;
  image?: string;
  url?: string;
  displayOrder: number;
  category?: string;
}

export interface ProfileData {
  username: string;
  displayName: string;
  bio: string;
  profilePhoto: ProfilePhoto;
  links: Link[];
  highlights: Highlight[];
}

export interface ProfileResponse {
  id: string;
  userId: string;
  username: string;
  profileData: ProfileData;
  createdAt: Date;
  updatedAt: Date;
}
