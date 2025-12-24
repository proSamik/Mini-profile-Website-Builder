import { NextRequest, NextResponse } from 'next/server';
import { getPresignedUploadUrl } from '@/lib/storage';
import { requireAuth } from '@/lib/auth/api-auth';

// POST /api/upload - Get presigned URL for direct upload to R2
export async function POST(request: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const { userId, fileName, contentType } = body;

    // Ensure user can only upload for their own account
    if (userId !== session!.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

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
