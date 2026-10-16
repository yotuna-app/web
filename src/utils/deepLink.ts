import { appSettings } from "@/constants/app";

/**
 * Returns the direct Google Play Store URL for Yotuna.
 */
export function getGooglePlayUrl(): string {
  return `https://play.google.com/store/apps/details?id=${appSettings.store.androidPackage}`;
}

/**
 * Constructs an Android Intent URI with fallback to Google Play.
 * If the user is viewing a station page (/station/:id), creates a deep link to that station.
 * Otherwise, links to the home screen.
 */
export function getAndroidIntentUrl(pathname: string): string {
  const pkg = appSettings.store.androidPackage;
  const fallbackUrl = encodeURIComponent(getGooglePlayUrl());

  const stationMatch = pathname.match(/^\/station\/([^/?#]+)/);
  if (stationMatch && stationMatch[1]) {
    const stationId = stationMatch[1];
    return `intent://station/${stationId}#Intent;scheme=yotuna;package=${pkg};S.browser_fallback_url=${fallbackUrl};end;`;
  }

  return `intent://home#Intent;scheme=yotuna;package=${pkg};S.browser_fallback_url=${fallbackUrl};end;`;
}
