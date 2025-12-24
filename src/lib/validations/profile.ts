import { z } from 'zod';

export const ProfilePhotoSchema = z.object({
  type: z.enum(['url', 'placeholder', 'uploaded']),
  value: z.string(),
});

export const LinkSchema = z.object({
  id: z.string(),
  label: z.string().min(1).max(50),
  url: z.string().url(),
  icon: z.string(),
  displayOrder: z.number().int().min(0),
  favicon: z.string().url().optional(),
});

export const HighlightSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  images: z.array(z.string().url()).optional(),
  url: z.string().url().optional(),
  displayOrder: z.number().int().min(0),
  category: z.string().optional(),
});

export const ProfileDataSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
  displayName: z.string().min(1, 'Display name is required').max(50),
  bio: z.string().max(160, 'Bio must be at most 160 characters'),
  profilePhoto: ProfilePhotoSchema,
  links: z.array(LinkSchema),
  highlights: z.array(HighlightSchema),
  layout: z.enum(['default', 'layout1', 'layout2', 'layout3', 'layout4']).optional(),
});

export const CreateProfileSchema = z.object({
  userId: z.string(),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_-]+$/),
  profileData: ProfileDataSchema,
});

export const UpdateProfileSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_-]+$/)
    .optional(),
  profileData: ProfileDataSchema.partial().optional(),
});
