import { NextResponse } from 'next/server';
import { getRecentProfiles } from '@/lib/db/queries';

export async function GET() {
  try {
    const profiles = await getRecentProfiles(20);
    return NextResponse.json(profiles);
  } catch (error) {
    console.error('Error fetching recent profiles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent profiles' },
      { status: 500 }
    );
  }
}
