import { NextRequest, NextResponse } from 'next/server';
import { checkUsernameAvailability } from '@/lib/db/queries';

// GET /api/profiles/check-username?username=xxx&excludeUserId=xxx
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get('username');
    const excludeUserId = searchParams.get('excludeUserId') || undefined;

    if (!username) {
      return NextResponse.json({ error: 'username is required' }, { status: 400 });
    }

    const isAvailable = await checkUsernameAvailability(username, excludeUserId);

    return NextResponse.json({ available: isAvailable });
  } catch (error) {
    console.error('Error checking username:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
