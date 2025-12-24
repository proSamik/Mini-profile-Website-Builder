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
    
    // Use favicone.com API
    const faviconeUrl = `https://favicone.com/${urlObj.hostname}`;
    const response = await fetch(faviconeUrl);
    
    if (response.ok) {
      const data = await response.json();
      if (data.hasIcon && data.icon) {
        return NextResponse.json({ favicon: data.icon });
      }
    }
    
    // Fallback to Google's favicon service
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;
    return NextResponse.json({ favicon: faviconUrl });
  } catch (error) {
    console.error('Error fetching favicon:', error);
    
    // Try to extract domain and use Google's service as fallback
    try {
      const urlObj = new URL(url);
      const faviconUrl = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;
      return NextResponse.json({ favicon: faviconUrl });
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }
  }
}
