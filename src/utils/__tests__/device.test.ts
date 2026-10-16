import { describe, it, expect, afterEach } from "vitest";
import { isAndroidDevice } from "@/utils/device";

describe("device utility - isAndroidDevice", () => {
  const originalUserAgent = navigator.userAgent;

  afterEach(() => {
    Object.defineProperty(navigator, "userAgent", {
      value: originalUserAgent,
      configurable: true,
    });
  });

  function setUserAgent(ua: string) {
    Object.defineProperty(navigator, "userAgent", {
      value: ua,
      configurable: true,
    });
  }

  it("returns true for standard Android mobile User-Agent", () => {
    setUserAgent(
      "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
    );
    expect(isAndroidDevice()).toBe(true);
  });

  it("returns true for Android tablet User-Agent", () => {
    setUserAgent(
      "Mozilla/5.0 (Linux; Android 13; SM-X906B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
    );
    expect(isAndroidDevice()).toBe(true);
  });

  it("returns false for iPhone User-Agent", () => {
    setUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
    );
    expect(isAndroidDevice()).toBe(false);
  });

  it("returns false for desktop Chrome on Mac", () => {
    setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );
    expect(isAndroidDevice()).toBe(false);
  });

  it("returns false for desktop Chrome on Windows", () => {
    setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );
    expect(isAndroidDevice()).toBe(false);
  });

  it("returns false for SmartTV user agents even if Android is present in UA", () => {
    setUserAgent(
      "Mozilla/5.0 (Linux; Android 11; SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36"
    );
    expect(isAndroidDevice()).toBe(false);
  });
});
