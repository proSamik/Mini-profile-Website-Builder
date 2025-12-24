import { NextResponse } from 'next/server';
import { getRecentProfiles } from '@/lib/db/queries';

export const revalidate = 300; // Revalidate every 5 minutes

export async function GET() {
  try {
    const profiles = await getRecentProfiles(20);
    
    // Cache the response for 5 minutes
    return NextResponse.json(profiles, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching recent profiles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent profiles' },
      { status: 500 }
    );
  }
}
