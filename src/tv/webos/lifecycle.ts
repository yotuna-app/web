/**
 * webOS TV lifecycle management.
 * Handles back button, screen saver prevention, and app visibility.
 */

const BACK_KEY = 461; // webOS back button keyCode

/**
 * Register a global back button handler.
 * Supports webOS remote Back button (keyCode 461), key name ("Back", "GoBack"),
 * emulator/simulator Escape, and popstate navigation.
 * Returns a cleanup function.
 */
export function registerBackHandler(onBack: () => void): () => void {
  function handleKeyDown(e: KeyboardEvent) {
    if (
      e.keyCode === BACK_KEY ||
      e.key === "Back" ||
      e.key === "GoBack" ||
      e.key === "Escape" ||
      e.keyCode === 27
    ) {
      e.preventDefault();
      e.stopPropagation();
      onBack();
    }
  }

  function handlePopState(e: PopStateEvent) {
    e.preventDefault();
    onBack();
  }

  document.addEventListener("keydown", handleKeyDown, true);
  window.addEventListener("popstate", handlePopState);

  return () => {
    document.removeEventListener("keydown", handleKeyDown, true);
    window.removeEventListener("popstate", handlePopState);
  };
}

/**
 * Prevent the screen saver from activating.
 * Uses the webOS-specific window.webOS API if available,
 * otherwise falls back to a keep-alive video element.
 */
export function preventScreenSaver(): void {
  // Try webOS keepAlive API
  const webOS = (window as unknown as Record<string, unknown>).webOS as
    | { service?: { request?: (uri: string, params: Record<string, unknown>) => void } }
    | undefined;

  if (webOS?.service?.request) {
    try {
      webOS.service.request("luna://com.webos.service.tvpower", {
        method: "turnOnScreenSaver",
        parameters: { subscribe: true, screenSaverOn: false },
        onSuccess: () => {
          /* screen saver disabled */
        },
        onFailure: () => {
          /* fallback will be used */
        },
      } as unknown as Record<string, unknown>);
      return;
    } catch {
      // Fall through to fallback
    }
  }

  // Fallback: a tiny transparent video that keeps the display active
  try {
    const video = document.createElement("video");
    video.setAttribute("playsinline", "");
    video.setAttribute("muted", "");
    video.setAttribute("loop", "");
    video.style.position = "fixed";
    video.style.top = "-1px";
    video.style.left = "-1px";
    video.style.width = "1px";
    video.style.height = "1px";
    video.style.opacity = "0.01";

    // Minimal blank video as data URI (1-frame, 1x1 transparent webm)
    video.src =
      "data:video/webm;base64,GkXfo59ChoEBQveBAULygQRC84EIQoKEd2VibUKHgQRChYECGFOAZwH/////////FUmpZpkq17GDD0JATYCGQ2hyb21lV0WGQ2hyb21lFlSua7+uvdeBAXPFh0VJTUVEQAdrbW9vZGVkRImIQNCCAAdTA7sBAAAAAAAAB0CIQAACAAAAAABhAAAAAAAVT5AAAQ==";

    document.body.appendChild(video);
    video.play().catch(() => {
      /* ignore */
    });
  } catch {
    // Not critical - screen saver may still activate
  }
}

/**
 * Handle app visibility changes (minimize/restore on webOS).
 */
export function registerVisibilityHandler(
  onHidden: () => void,
  onVisible: () => void,
): () => void {
  function handleVisibility() {
    if (document.hidden) {
      onHidden();
    } else {
      onVisible();
    }
  }

  document.addEventListener("visibilitychange", handleVisibility);
  return () => document.removeEventListener("visibilitychange", handleVisibility);
}
