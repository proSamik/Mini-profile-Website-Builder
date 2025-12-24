import { eq, desc } from 'drizzle-orm';
import { db } from './client';
import { profiles, users } from './schema';

export async function getProfileById(id: string) {
  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, id))
    .limit(1);

  return profile;
}

export async function getProfileByUserId(userId: string) {
  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);

  return profile;
}

export async function getProfileByUsername(username: string) {
  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.username, username))
    .limit(1);

  return profile;
}

export async function checkUsernameAvailability(username: string, excludeUserId?: string) {
  const [existing] = await db
    .select({ userId: profiles.userId })
    .from(profiles)
    .where(eq(profiles.username, username))
    .limit(1);

  if (!existing) return true;
  if (excludeUserId && existing.userId === excludeUserId) return true;

  return false;
}

export async function getRecentProfiles(limit: number = 20) {
  const recentProfiles = await db
    .select()
    .from(profiles)
    .orderBy(desc(profiles.createdAt))
    .limit(limit);

  return recentProfiles;
}

export async function getUserById(id: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  return user;
}

export async function getUserByUsername(username: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  return user;
}
