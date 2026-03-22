import { describe, it, expect, beforeEach, vi } from "vitest";
import { useSettingsStore } from "@/stores/settingsStore";

// Mock i18n
vi.mock("@/i18n", () => ({
  default: {
    changeLanguage: vi.fn(),
    language: "en",
  },
  updateDocumentDirection: vi.fn(),
  SUPPORTED_LANGUAGES: ["en", "pl", "de", "fr", "es", "ar", "zh", "hi", "ja"] as const,
  RTL_LANGUAGES: ["ar"],
}));

// Mock analytics
vi.mock("@/analytics", () => ({
  tracker: {
    trackEvent: vi.fn(),
    trackPageView: vi.fn(),
  },
  AnalyticsEvents: {
    THEME_CHANGED: "theme_changed",
    LANGUAGE_CHANGED: "language_changed",
  },
}));

describe("settingsStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useSettingsStore.setState({
      theme: "system",
    });
  });

  it("has default theme 'system'", () => {
    const { theme } = useSettingsStore.getState();
    expect(theme).toBe("system");
  });

  it("sets theme to dark", () => {
    useSettingsStore.getState().setTheme("dark");
    expect(useSettingsStore.getState().theme).toBe("dark");
    expect(localStorage.getItem("yotuna-theme")).toBe("dark");
  });

  it("sets theme to light", () => {
    useSettingsStore.getState().setTheme("light");
    expect(useSettingsStore.getState().theme).toBe("light");
    expect(localStorage.getItem("yotuna-theme")).toBe("light");
  });

  it("toggles dark class on html element", () => {
    useSettingsStore.getState().setTheme("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    useSettingsStore.getState().setTheme("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("initTheme applies system theme", () => {
    useSettingsStore.getState().initTheme();
    const { theme } = useSettingsStore.getState();
    expect(theme).toBe("system");
  });

  it("sets language via i18n", async () => {
    const { default: i18n } = await import("@/i18n");
    const mockedChangeLanguage = vi.mocked(i18n.changeLanguage);
    useSettingsStore.getState().setLanguage("pl");
    expect(mockedChangeLanguage).toHaveBeenCalledWith("pl");
  });
});
