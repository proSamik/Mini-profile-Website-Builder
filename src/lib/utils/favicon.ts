export async function getFaviconUrl(url: string): Promise<string | null> {
  try {
    console.log('Fetching favicon for URL:', url);
    const response = await fetch(`/api/favicon?url=${encodeURIComponent(url)}`);
    
    console.log('Favicon API response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Favicon API error:', errorData);
      throw new Error('Failed to fetch favicon');
    }

    const data = await response.json();
    console.log('Favicon API response data:', data);
    return data.favicon || null;
  } catch (error) {
    console.error('Error fetching favicon:', error);
    return null;
  }
}
