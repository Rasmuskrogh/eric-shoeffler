/**
 * Konverterar en Spotify URL till embed-format
 *
 * Stödjer följande format:
 * - https://open.spotify.com/track/TRACK_ID
 * - https://open.spotify.com/album/ALBUM_ID
 * - https://open.spotify.com/playlist/PLAYLIST_ID
 * - https://open.spotify.com/artist/ARTIST_ID
 * - https://open.spotify.com/episode/EPISODE_ID
 * - https://open.spotify.com/show/SHOW_ID
 * - https://open.spotify.com/embed/... (returnerar som den är med ?utm_source=generator)
 *
 * @param url - Spotify URL (kan vara track, album, playlist, artist, episode eller show)
 * @returns Embed URL eller null om URL:en är ogiltig
 */
export function getSpotifyEmbedUrl(
  url: string | null | undefined
): string | null {
  if (!url) return null;

  // Om det redan är en embed-URL, lägg till utm_source om det saknas
  if (url.includes("open.spotify.com/embed/")) {
    if (url.includes("?utm_source=")) {
      return url;
    }
    return `${url}${url.includes("?") ? "&" : "?"}utm_source=generator`;
  }

  // Hantera olika Spotify URL-format
  // Format: https://open.spotify.com/TYPE/ID?si=...
  // Typer: track, album, playlist, artist, episode, show

  const spotifyRegex =
    /^https?:\/\/open\.spotify\.com\/(track|album|playlist|artist|episode|show)\/([a-zA-Z0-9]+)/;
  const match = url.match(spotifyRegex);

  if (match && match[1] && match[2]) {
    const type = match[1];
    const id = match[2];
    return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator`;
  }

  // Om vi inte kan extrahera type och ID, returnera null
  return null;
}
