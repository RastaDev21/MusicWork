export function getSpotifyEmbedUrl(spotify: string): string | null {
  if (!spotify) return null;

  const match = spotify.match(
    /open\.spotify\.com\/(?:intl-[a-zA-Z]+\/)?(artist|track|album|playlist)\/([a-zA-Z0-9]+)/,
  );

  if (!match) return null;

  const [, type, id] = match;
  return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
}
