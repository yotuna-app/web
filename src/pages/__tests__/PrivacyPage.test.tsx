import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import PrivacyPage from "@/pages/PrivacyPage";

// Mock i18n
vi.mock("@/i18n", () => ({
  default: { changeLanguage: vi.fn(), language: "en", on: vi.fn() },
  updateDocumentDirection: vi.fn(),
  SUPPORTED_LANGUAGES: ["en"] as const,
  RTL_LANGUAGES: [],
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        "privacy.title": "Privacy Policy",
        "privacy.intro": "Your privacy matters.",
        "privacy.localData": "Local Data",
        "privacy.localDataDescription": "We store data locally.",
        "privacy.analytics": "Analytics",
        "privacy.analyticsDescription": "We use analytics.",
        "privacy.cookies": "Cookies",
        "privacy.cookiesDescription": "We use cookies.",
        "privacy.streaming": "Streaming",
        "privacy.streamingDescription": "Streaming services.",
        "privacy.audioStreaming": "Audio Streaming",
        "privacy.audioStreamingDescription": "Audio is streamed.",
        "privacy.contact": "Contact",
        "privacy.contactDescription": "Contact us.",
      };
      return map[key] ?? key;
    },
    i18n: { language: "en" },
  }),
  initReactI18next: { type: "3rdParty", init: vi.fn() },
}));

vi.mock("@/analytics", () => ({
  tracker: { trackPageView: vi.fn(), trackEvent: vi.fn() },
  AnalyticsEvents: {},
}));

describe("PrivacyPage", () => {
  it("renders the title", () => {
    render(<PrivacyPage />);
    expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
  });

  it("renders intro text", () => {
    render(<PrivacyPage />);
    expect(screen.getByText("Your privacy matters.")).toBeInTheDocument();
  });

  it("renders all privacy sections", () => {
    render(<PrivacyPage />);
    expect(screen.getByText("Local Data")).toBeInTheDocument();
    expect(screen.getByText("Analytics")).toBeInTheDocument();
    expect(screen.getByText("Cookies")).toBeInTheDocument();
    expect(screen.getByText("Streaming")).toBeInTheDocument();
    expect(screen.getByText("Audio Streaming")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  it("renders section descriptions", () => {
    render(<PrivacyPage />);
    expect(screen.getByText("We store data locally.")).toBeInTheDocument();
    expect(screen.getByText("We use analytics.")).toBeInTheDocument();
    expect(screen.getByText("We use cookies.")).toBeInTheDocument();
  });

  it("tracks page view on mount", async () => {
    const { tracker } = await import("@/analytics");
    const mockedTrackPageView = vi.mocked(tracker.trackPageView);
    mockedTrackPageView.mockClear();
    render(<PrivacyPage />);
    expect(mockedTrackPageView).toHaveBeenCalledWith("privacy");
  });
});
