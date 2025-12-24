export async function getFaviconUrl(url: string): Promise<string | null> {
  try {
    const response = await fetch(`/api/favicon?url=${encodeURIComponent(url)}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch favicon');
    }

    const data = await response.json();
    return data.favicon || null;
  } catch (error) {
    console.error('Error fetching favicon:', error);
    return null;
  }
}
