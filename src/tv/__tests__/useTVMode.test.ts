import { describe, it, expect, afterEach } from "vitest";
import { isTVEnvironment } from "../useTVMode";

describe("isTVEnvironment", () => {
  const originalUserAgent = navigator.userAgent;

  afterEach(() => {
    Object.defineProperty(navigator, "userAgent", {
      value: originalUserAgent,
      configurable: true,
    });
    delete (window as unknown as Record<string, unknown>).webOS;
    delete (window as unknown as Record<string, unknown>).webOSSystem;
    delete (window as unknown as Record<string, unknown>).PalmSystem;
    window.history.replaceState({}, "", "/");
  });

  it("returns false by default in standard browser environment", () => {
    expect(isTVEnvironment()).toBe(false);
  });

  it("detects TV mode when ?tv=1 query param is present", () => {
    window.history.replaceState({}, "", "/?tv=1");
    expect(isTVEnvironment()).toBe(true);
  });

  it("detects TV mode when ?mode=tv query param is present", () => {
    window.history.replaceState({}, "", "/?mode=tv");
    expect(isTVEnvironment()).toBe(true);
  });

  it("detects TV mode when window.webOS is defined", () => {
    (window as unknown as Record<string, unknown>).webOS = {};
    expect(isTVEnvironment()).toBe(true);
  });

  it("detects TV mode when window.webOSSystem is defined", () => {
    (window as unknown as Record<string, unknown>).webOSSystem = {};
    expect(isTVEnvironment()).toBe(true);
  });

  it("detects TV mode when userAgent contains webOS", () => {
    Object.defineProperty(navigator, "userAgent", {
      value: "Mozilla/5.0 (Web0S; SmartTV; LG OLED65G36LA)",
      configurable: true,
    });
    expect(isTVEnvironment()).toBe(true);
  });
});
