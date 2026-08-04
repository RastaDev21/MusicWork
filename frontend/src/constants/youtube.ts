export function getYoutubeEmbedUrl(text: string): string | null {
  if (!text) return null;

  const watchMatch = text.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]{6,})/);
  if (watchMatch) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }

  const shortMatch = text.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
  if (shortMatch) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`;
  }

  const shortsMatch = text.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{6,})/);
  if (shortsMatch) {
    return `https://www.youtube.com/embed/${shortsMatch[1]}`;
  }

  return null;
}
