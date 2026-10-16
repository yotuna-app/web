import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import AndroidAppBanner, { ANDROID_BANNER_DISMISSED_KEY } from "@/components/common/AndroidAppBanner";
import { tracker, AnalyticsEvents } from "@/analytics";

// Mock i18n
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        "appBanner.title": "Yotuna",
        "appBanner.subtitle": "Listen in the Android app",
        "appBanner.open": "Open",
        "appBanner.dismiss": "Dismiss",
      };
      return map[key] ?? key;
    },
    i18n: { language: "en" },
  }),
}));

// Mock analytics
vi.mock("@/analytics", () => ({
  tracker: {
    trackEvent: vi.fn(),
  },
  AnalyticsEvents: {
    APP_BANNER_IMPRESSION: "app_banner_impression",
    APP_BANNER_CLICKED: "app_banner_clicked",
    APP_BANNER_DISMISSED: "app_banner_dismissed",
  },
}));

describe("AndroidAppBanner", () => {
  const originalUserAgent = navigator.userAgent;

  function setAndroidUserAgent() {
    Object.defineProperty(navigator, "userAgent", {
      value: "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/120.0 Mobile Safari/537.36",
      configurable: true,
    });
  }

  function setDesktopUserAgent() {
    Object.defineProperty(navigator, "userAgent", {
      value: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0 Safari/537.36",
      configurable: true,
    });
  }

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    Object.defineProperty(navigator, "userAgent", {
      value: originalUserAgent,
      configurable: true,
    });
  });

  function renderBanner(initialRoute = "/") {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <AndroidAppBanner />
      </MemoryRouter>
    );
  }

  it("does not render on non-Android devices", () => {
    setDesktopUserAgent();
    renderBanner();
    expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
    expect(screen.queryByText("Listen in the Android app")).not.toBeInTheDocument();
  });

  it("does not render on Android if previously dismissed in localStorage", () => {
    setAndroidUserAgent();
    localStorage.setItem(ANDROID_BANNER_DISMISSED_KEY, "true");
    renderBanner();
    expect(screen.queryByText("Listen in the Android app")).not.toBeInTheDocument();
  });

  it("renders on Android and tracks impression when not dismissed", () => {
    setAndroidUserAgent();
    renderBanner();

    expect(screen.getByText("Yotuna")).toBeInTheDocument();
    expect(screen.getByText("Listen in the Android app")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Dismiss" })).toBeInTheDocument();

    expect(tracker.trackEvent).toHaveBeenCalledWith(AnalyticsEvents.APP_BANNER_IMPRESSION);
  });

  it("generates home intent link when on root route", () => {
    setAndroidUserAgent();
    renderBanner("/");

    const link = screen.getByRole("link", { name: "Open" });
    expect(link.getAttribute("href")).toContain("intent://home#Intent;scheme=yotuna;package=com.mobulum.yotuna");
  });

  it("generates station deep link when on station page", () => {
    setAndroidUserAgent();
    renderBanner("/station/pl-radio-nowy-swiat");

    const link = screen.getByRole("link", { name: "Open" });
    expect(link.getAttribute("href")).toContain(
      "intent://station/pl-radio-nowy-swiat#Intent;scheme=yotuna;package=com.mobulum.yotuna"
    );
  });

  it("tracks click event when Open button is clicked", async () => {
    setAndroidUserAgent();
    renderBanner();

    const link = screen.getByRole("link", { name: "Open" });
    await userEvent.click(link);

    expect(tracker.trackEvent).toHaveBeenCalledWith(AnalyticsEvents.APP_BANNER_CLICKED);
  });

  it("dismisses banner, saves to localStorage, and tracks dismissal event when X is clicked", async () => {
    setAndroidUserAgent();
    renderBanner();

    const dismissButton = screen.getByRole("button", { name: "Dismiss" });
    await userEvent.click(dismissButton);

    expect(localStorage.getItem(ANDROID_BANNER_DISMISSED_KEY)).toBe("true");
    expect(screen.queryByText("Listen in the Android app")).not.toBeInTheDocument();
    expect(tracker.trackEvent).toHaveBeenCalledWith(AnalyticsEvents.APP_BANNER_DISMISSED);
  });
});
