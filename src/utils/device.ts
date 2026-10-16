import { isTVEnvironment } from "@/tv/useTVMode";

/**
 * Checks whether the current user is visiting from an Android mobile/tablet device.
 * Excludes TV environments (webOS, Tizen, Android TV, etc.).
 */
export function isAndroidDevice(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }

  if (isTVEnvironment()) {
    return false;
  }

  const ua = navigator.userAgent || "";
  return /Android/i.test(ua);
}
