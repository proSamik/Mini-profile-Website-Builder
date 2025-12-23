import { NextRequest, NextResponse } from 'next/server';
import { getPresignedUploadUrl } from '@/lib/storage';

// POST /api/upload - Get presigned URL for direct upload to R2
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, fileName, contentType } = body;

    if (!userId || !fileName || !contentType) {
      return NextResponse.json(
        { error: 'userId, fileName, and contentType are required' },
        { status: 400 }
      );
    }

    // Validate content type (only images)
    if (!contentType.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    // Get presigned upload URL
    const { key, uploadUrl, publicUrl } = await getPresignedUploadUrl(userId, fileName, contentType);

    return NextResponse.json({
      key,
      uploadUrl,
      publicUrl,
    });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
