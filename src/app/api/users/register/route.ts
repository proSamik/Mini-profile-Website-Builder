import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/db/mutations';
import { createProfile } from '@/lib/db/mutations';
import { getUserByUsername } from '@/lib/db/queries';
import { hashPassword } from '@/lib/auth/password';
import { SignupSchema } from '@/lib/validations/user';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = SignupSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { username, password } = validation.data;

    // Check if username already exists
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 400 }
      );
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password);
    const user = await createUser(username, passwordHash);

    // Create empty profile for the user
    const defaultProfileData = {
      username,
      displayName: username,
      bio: '',
      profilePhoto: {
        type: 'placeholder' as const,
        value: username.charAt(0).toUpperCase(),
      },
      links: [],
      highlights: [],
    };

    await createProfile(user.id, username, defaultProfileData);

    return NextResponse.json(
      { message: 'Account created successfully', userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
