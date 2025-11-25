/**
 * Konverterar en YouTube URL till embed-format
 *
 * Stödjer följande format:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/watch?v=VIDEO_ID&t=123s
 * - https://www.youtube.com/embed/VIDEO_ID (returnerar som den är)
 *
 * @param url - YouTube URL (kan vara watch, youtu.be eller embed format)
 * @returns Embed URL eller null om URL:en är ogiltig
 */
export function getYouTubeEmbedUrl(
  url: string | null | undefined
): string | null {
  if (!url) return null;

  // Om det redan är en embed-URL, returnera den direkt
  if (url.includes("youtube.com/embed/")) {
    return url;
  }

  // Hantera olika YouTube URL-format
  // Format 1: https://www.youtube.com/watch?v=VIDEO_ID
  // Format 2: https://youtu.be/VIDEO_ID
  // Format 3: https://www.youtube.com/watch?v=VIDEO_ID&t=123s

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }

  // Om vi inte kan extrahera video ID, returnera null
  return null;
}
