import { describe, it, expect } from "vitest";
import { formatPlaylistTime, formatDayLabel, getPlaylistDateRange, getBrowserLocale } from "@/utils/dates";

describe("getBrowserLocale", () => {
  it("returns a non-empty string", () => {
    const locale = getBrowserLocale();
    expect(locale).toBeTruthy();
    expect(typeof locale).toBe("string");
  });
});

describe("formatPlaylistTime", () => {
  it("formats a date string to time using browser locale", () => {
    const result = formatPlaylistTime("2025-01-15T14:30:00Z");
    expect(result).toContain(":");
    expect(result).toMatch(/\d{1,2}:\d{2}/);
  });

  it("returns original string on invalid date", () => {
    const result = formatPlaylistTime("not-a-date");
    expect(result).toBe("not-a-date");
  });
});

describe("formatDayLabel", () => {
  it("formats a date with browser locale", () => {
    const date = new Date(2025, 0, 15); // Jan 15, 2025 (Wednesday)
    const result = formatDayLabel(date);
    expect(result).toContain("15");
    expect(result).toBeTruthy();
  });
});

describe("getPlaylistDateRange", () => {
  it("returns from/to for a given date", () => {
    const date = new Date(2025, 0, 15); // Jan 15, 2025 local
    const { from, to } = getPlaylistDateRange(date);
    expect(from).toBe("2025-01-15T00:00:00");
    expect(to).toBe("2025-01-15T23:59:59");
  });
});
