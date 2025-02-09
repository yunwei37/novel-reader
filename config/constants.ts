/**
 * Application-wide constants and configuration values
 */
export const CONFIG = {
  // Site URLs
  GITHUB_REPO: 'https://github.com/yourusername/web-novel-reader', // Update this with your actual repo URL
  HOME_PAGE: 'https://webnovel.win', // Updated to a more professional domain
  CANONICAL_DOMAIN: 'https://app.webnovel.win', // Base URL for canonical links

  // Analytics
  GOOGLE_ANALYTICS_ID: 'G-DGH8HNQKE4',

  // PWA Settings
  PWA: {
    THEME_COLOR: '#000000',
    ICON_192: '/icons/icon-192x192.png',
  },
} as const; 
