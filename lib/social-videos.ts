/**
 * Utility functions for Social Videos validation and URL normalization.
 */

export function validateSocialVideoUrl(
  platform: string,
  url: string
): { valid: boolean; normalized?: string; error?: string } {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return { valid: false, error: 'Video URL is required.' };
  }

  const trimmed = url.trim();

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase().replace('www.', '');

    if (platform === 'youtube') {
      const isYt = host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtu.be';
      if (!isYt) {
        return { valid: false, error: 'Invalid YouTube URL. Must be a link from youtube.com or youtu.be.' };
      }

      // Check for shorts or watch parameter or youtu.be id
      const isShorts = parsed.pathname.includes('/shorts/');
      const hasWatchV = parsed.pathname.includes('/watch') && parsed.searchParams.get('v');
      const isShortLink = host === 'youtu.be' && parsed.pathname.length > 1;

      if (!isShorts && !hasWatchV && !isShortLink) {
        return {
          valid: false,
          error:
            'Please enter a valid YouTube video or Shorts link (e.g., https://youtube.com/shorts/... or https://youtu.be/...)',
        };
      }

      return { valid: true, normalized: trimmed };
    }

    if (platform === 'instagram') {
      const isIg = host === 'instagram.com' || host === 'm.instagram.com';
      if (!isIg) {
        return { valid: false, error: 'Invalid Instagram URL. Must be a link from instagram.com.' };
      }

      const isReelOrPost =
        parsed.pathname.includes('/reel/') ||
        parsed.pathname.includes('/reels/') ||
        parsed.pathname.includes('/p/');
      if (!isReelOrPost) {
        return {
          valid: false,
          error: 'Please enter a valid Instagram Reel link (e.g., https://www.instagram.com/reel/...)',
        };
      }

      return { valid: true, normalized: trimmed };
    }

    return { valid: false, error: `Unsupported platform "${platform}". Must be "instagram" or "youtube".` };
  } catch {
    return { valid: false, error: 'Malformed URL. Please provide a full valid URL including https://.' };
  }
}

