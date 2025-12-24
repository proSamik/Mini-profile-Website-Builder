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
    const domain = urlObj.hostname;
    
    // Try DuckDuckGo's favicon service (reliable and fast)
    const duckduckgoUrl = `https://icons.duckduckgo.com/ip3/${domain}.ico`;
    
    try {
      const ddgResponse = await fetch(duckduckgoUrl, { method: 'HEAD' });
      if (ddgResponse.ok) {
        return NextResponse.json({ favicon: duckduckgoUrl });
      }
    } catch (e) {
      // Fallback to Google
    }
    
    // Try Google's favicon service as fallback
    const googleUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    return NextResponse.json({ favicon: googleUrl });
    
  } catch (error) {
    console.error('Error in favicon API:', error);
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }
}
