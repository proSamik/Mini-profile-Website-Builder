import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { db } from './client';
import { profiles, users } from './schema';
import { ProfileData } from '@/types/profile';

export async function createProfile(userId: string, username: string, profileData: ProfileData) {
  const id = nanoid();

  const [newProfile] = await db
    .insert(profiles)
    .values({
      id,
      userId,
      username,
      profileData: profileData as any,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return newProfile;
}

export async function updateProfile(userId: string, updates: { username?: string; profileData?: Partial<ProfileData> }) {
  const existing = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);

  if (!existing[0]) {
    throw new Error('Profile not found');
  }

  const updateData: any = {
    updatedAt: new Date(),
  };

  if (updates.username) {
    updateData.username = updates.username;
  }

  if (updates.profileData) {
    const currentData = existing[0].profileData as ProfileData;
    updateData.profileData = {
      ...currentData,
      ...updates.profileData,
    } as any;
  }

  const [updatedProfile] = await db
    .update(profiles)
    .set(updateData)
    .where(eq(profiles.userId, userId))
    .returning();

  return updatedProfile;
}

export async function updateProfileData(userId: string, profileData: ProfileData) {
  const [updatedProfile] = await db
    .update(profiles)
    .set({
      profileData: profileData as any,
      updatedAt: new Date(),
    })
    .where(eq(profiles.userId, userId))
    .returning();

  return updatedProfile;
}

export async function deleteProfile(userId: string) {
  await db.delete(profiles).where(eq(profiles.userId, userId));
}

export async function createUser(username: string, passwordHash: string) {
  const id = nanoid();

  const [newUser] = await db
    .insert(users)
    .values({
      id,
      username,
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return newUser;
}

export async function updateUserPassword(userId: string, newPasswordHash: string) {
  const [updatedUser] = await db
    .update(users)
    .set({
      passwordHash: newPasswordHash,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))
    .returning();

  return updatedUser;
}
