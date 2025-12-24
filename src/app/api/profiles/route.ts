import { NextRequest, NextResponse } from 'next/server';
import { createProfile, updateProfileData } from '@/lib/db/mutations';
import { getProfileByUserId, checkUsernameAvailability } from '@/lib/db/queries';
import { ProfileDataSchema } from '@/lib/validations/profile';
import { ProfileData } from '@/types/profile';
import { requireAuth } from '@/lib/auth/api-auth';

// GET /api/profiles?userId=xxx - Get profile by user ID
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const profile = await getProfileByUserId(userId);

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/profiles - Create a new profile
export async function POST(request: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const { userId, username, profileData } = body;

    // Ensure user can only create their own profile
    if (userId !== session!.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (!userId || !username || !profileData) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate profile data
    const validatedData = ProfileDataSchema.parse(profileData);

    // Check username availability
    const isAvailable = await checkUsernameAvailability(username);
    if (!isAvailable) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
    }

    // Create profile
    const newProfile = await createProfile(userId, username, validatedData);

    return NextResponse.json(newProfile, { status: 201 });
  } catch (error: any) {
    console.error('Error creating profile:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid profile data', details: error.errors }, { status: 400 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/profiles - Update profile
export async function PUT(request: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const { userId, profileData } = body;

    // Ensure user can only update their own profile
    if (userId !== session!.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (!userId || !profileData) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate profile data
    const validatedData = ProfileDataSchema.parse(profileData);

    // Update profile
    const updatedProfile = await updateProfileData(userId, validatedData);

    if (!updatedProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(updatedProfile);
  } catch (error: any) {
    console.error('Error updating profile:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid profile data', details: error.errors }, { status: 400 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
