import type { ContentData } from "../../types";

/**
 * Helper function to ensure values are primitive (not objects)
 * Converts objects to strings, extracts URLs from image objects, and skips empty objects
 */
export function sanitizeSharedData(data: ContentData): ContentData {
  const sanitized: ContentData = {};
  Object.keys(data).forEach((key) => {
    const value = data[key];
    // Om värdet är ett tomt objekt {}, hoppa över det
    if (
      value !== null &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      Object.keys(value).length === 0
    ) {
      return; // Hoppa över tomma objekt
    }
    // Om värdet är ett objekt (men inte null eller array), konvertera till sträng
    if (
      value !== null &&
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      // Om det är ett objekt, försök hämta URL eller konvertera till sträng
      const valueObj = value as Record<string, unknown>;
      if ("url" in valueObj && typeof valueObj.url === "string") {
        sanitized[key] = valueObj.url;
      } else {
        sanitized[key] = String(value);
      }
    } else {
      sanitized[key] = value;
    }
  });
  return sanitized;
}

