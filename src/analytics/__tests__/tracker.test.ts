import { describe, it, expect, vi, beforeEach } from "vitest";
import { tracker } from "@/analytics/tracker";
import { AnalyticsEvents } from "@/analytics/events";

describe("AnalyticsEvents", () => {
  it("has PAGE_VIEW event", () => {
    expect(AnalyticsEvents.PAGE_VIEW).toBe("page_view");
  });

  it("has AUDIO_PLAY event", () => {
    expect(AnalyticsEvents.AUDIO_PLAY).toBe("audio_play");
  });

  it("has all expected event categories", () => {
    // Navigation
    expect(AnalyticsEvents.PAGE_VIEW).toBeDefined();
    // Audio
    expect(AnalyticsEvents.AUDIO_PLAY).toBeDefined();
    expect(AnalyticsEvents.AUDIO_PAUSE).toBeDefined();
    expect(AnalyticsEvents.AUDIO_STOP).toBeDefined();
    // Station
    expect(AnalyticsEvents.STATION_FAVORITE).toBeDefined();
    expect(AnalyticsEvents.STATION_UNFAVORITE).toBeDefined();
    // Search
    expect(AnalyticsEvents.SEARCH_PERFORMED).toBeDefined();
    // Settings
    expect(AnalyticsEvents.THEME_CHANGED).toBeDefined();
    expect(AnalyticsEvents.LANGUAGE_CHANGED).toBeDefined();
    // GDPR
    expect(AnalyticsEvents.GDPR_CONSENT_GIVEN).toBeDefined();
    expect(AnalyticsEvents.GDPR_CONSENT_DECLINED).toBeDefined();
  });
});

describe("AnalyticsTracker", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "info").mockImplementation(() => {});
    vi.spyOn(console, "debug").mockImplementation(() => {});
  });

  it("tracks events with console output", () => {
    tracker.trackEvent(AnalyticsEvents.AUDIO_PLAY, { stationId: "test-123" });
    expect(console.log).toHaveBeenCalled();
  });

  it("tracks page views", () => {
    tracker.trackPageView("home");
    expect(console.log).toHaveBeenCalled();
  });

  it("tracks interactions", () => {
    tracker.trackInteraction("button", "click", { id: "play" });
    expect(console.info).toHaveBeenCalled();
  });

  it("sets context", () => {
    tracker.setContext("StationPage");
    expect(console.debug).toHaveBeenCalledWith(expect.stringContaining("StationPage"));
  });

  it("debug logs", () => {
    tracker.debug("test message", { extra: true });
    expect(console.debug).toHaveBeenCalledWith(expect.stringContaining("test message"), { extra: true });
  });

  it("info logs", () => {
    tracker.info("info message");
    expect(console.info).toHaveBeenCalledWith(expect.stringContaining("info message"));
  });
});
