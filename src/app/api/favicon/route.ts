import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    // Validate URL
    const urlObj = new URL(url);
    
    // Use Google's favicon service as it's reliable and fast
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;
    
    return NextResponse.json({ favicon: faviconUrl });
  } catch (error) {
    console.error('Error fetching favicon:', error);
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }
}
