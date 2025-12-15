export {};

declare global {
  interface Window {
    __ENV__: {
      NEXT_PUBLIC_API_URL?: string;
    };
  }
}

export function getApiUrl(): string {
  // Check if we are in the browser and have the injected env
  if (typeof window !== "undefined" && window.__ENV__?.NEXT_PUBLIC_API_URL) {
    return window.__ENV__.NEXT_PUBLIC_API_URL;
  }

  // Fallback to process.env (works on server and during build)
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
}

/**
 * Helper to get the correct asset URL (images, files, etc)
 * Handles rewriting localhost URLs to the runtime API URL
 */
export function getAssetUrl(url: string | null | undefined): string {
  if (!url) return "";
  
  // If it's already a full URL
  if (url.startsWith("http") || url.startsWith("blob:") || url.startsWith("data:")) {
    // If it's a blob or data URL, return as is
    if (url.startsWith("blob:") || url.startsWith("data:")) {
        return url;
    }

    // If it's a localhost URL (from seeder/dev)
    // If it's a localhost URL (from seeder/dev)
    // We rewrite it on both client (browser) and server (SSR) to ensure consistency
    // provided we have a valid API URL to rewrite to.
    if (url.includes("localhost")) {
        const apiUrl = getApiUrl();
        // Remove /api/v1 from API URL to get base URL
        const baseUrl = apiUrl.replace(/\/api\/v1\/?$/, "");
        
        // Extract the path from the localhost URL
        // e.g., http://localhost:8080/uploads/foo.jpg -> /uploads/foo.jpg
        try {
          const urlObj = new URL(url);
          return `${baseUrl}${urlObj.pathname}`;
        } catch {
          return url;
        }
    }
    return url;
  }
  
  // If it's a relative path (e.g. /uploads/foo.jpg)
  const apiUrl = getApiUrl();
  const baseUrl = apiUrl.replace(/\/api\/v1\/?$/, "");
  
  // Ensure path starts with /
  const path = url.startsWith("/") ? url : `/${url}`;
  return `${baseUrl}${path}`;
}
