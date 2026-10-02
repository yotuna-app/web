import { useState, useEffect } from "react";
import { init } from "@noriginmedia/norigin-spatial-navigation";
import { preventScreenSaver } from "./webos/lifecycle";

export function isTVEnvironment(): boolean {
  if (typeof window === "undefined") return false;

  // 0. Build-time TV flag or packaged webOS file protocol
  if (import.meta.env.VITE_TV_BUILD) {
    return true;
  }
  if (window.location.protocol === "file:") {
    return true;
  }

  // 1. Explicit query parameter override (e.g. ?tv=1 or ?mode=tv for testing & emulator)
  const params = new URLSearchParams(window.location.search);
  if (params.get("tv") === "1" || params.get("mode") === "tv") {
    return true;
  }

  // 2. webOS global objects
  const win = window as unknown as Record<string, unknown>;
  if (win.webOS || win.webOSSystem || win.PalmSystem) {
    return true;
  }

  // 3. User agent matching webOS, LG Smart TV, NetCast, etc.
  const ua = navigator.userAgent;
  if (/webOS|Web0S|NetCast|SmartTV|LG Browser|HbbTV/i.test(ua)) {
    return true;
  }

  // 4. LocalStorage preference
  try {
    if (localStorage.getItem("yotuna-tv-mode") === "true") {
      return true;
    }
  } catch {
    // Ignore localStorage errors
  }

  return false;
}

export function useTVMode() {
  const [isTV, setIsTV] = useState<boolean>(() => isTVEnvironment());

  useEffect(() => {
    // If not currently detected as TV, listen for TV remote key (461 Back key)
    if (!isTV) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.keyCode === 461) {
          setIsTV(true);
          try {
            localStorage.setItem("yotuna-tv-mode", "true");
          } catch {
            // ignore
          }
        }
      };
      window.addEventListener("keydown", handleKeyDown, { once: true });
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isTV]);

  useEffect(() => {
    if (!isTV) return;

    // Apply tv-mode class to body
    document.body.classList.add("tv-mode");

    // Initialize spatial navigation
    const showDebug = import.meta.env.DEV && !window.location.search.includes("nodebug");
    init({
      debug: showDebug,
      visualDebug: showDebug,
    });

    // Scale viewport for TV resolution (1920x1080 default, scale down for 720p)
    function applyViewportScale() {
      const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
      document.body.style.transform = scale < 1 ? `scale(${scale})` : "";
    }
    applyViewportScale();
    window.addEventListener("resize", applyViewportScale);

    // Prevent screen saver
    preventScreenSaver();

    return () => {
      document.body.classList.remove("tv-mode");
      document.body.style.transform = "";
      window.removeEventListener("resize", applyViewportScale);
    };
  }, [isTV]);

  return isTV;
}
