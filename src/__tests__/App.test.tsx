import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

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
        "nav.home": "Radio Stations",
        "nav.settings": "Settings",
        "nav.about": "About",
        "nav.privacy": "Privacy",
        "notFound.title": "Page Not Found",
        "notFound.message": "The page you are looking for does not exist.",
        "notFound.goHome": "Go Home",
        "privacy.title": "Privacy Policy",
        "privacy.intro": "Your privacy matters.",
        "privacy.localData": "Local Data",
        "privacy.localDataDescription": "Stored locally.",
        "privacy.analytics": "Analytics",
        "privacy.analyticsDescription": "Analytics desc.",
        "privacy.cookies": "Cookies",
        "privacy.cookiesDescription": "Cookies desc.",
        "privacy.streaming": "Streaming",
        "privacy.streamingDescription": "Streaming desc.",
        "privacy.audioStreaming": "Audio Streaming",
        "privacy.audioStreamingDescription": "Audio desc.",
        "privacy.contact": "Contact",
        "privacy.contactDescription": "Contact desc.",
        "about.title": "About Yotuna",
        "about.description": "Your radio companion.",
        "about.version": "Version",
        "about.features": "Features",
        "about.technology": "Technology",
        "about.community": "Community",
        "about.discordTitle": "Discord",
        "about.discordDescription": "Join our community.",
        "about.joinDiscord": "Join Discord",
        "about.mobileApps": "Mobile Apps",
        "about.appStore": "App Store",
        "about.playStore": "Google Play",
        "about.website": "Website",
        "about.deviceInfo": "Device Info",
        "about.deviceId": "Device ID",
        "about.feature1": "f1",
        "about.feature2": "f2",
        "about.feature3": "f3",
        "about.feature4": "f4",
        "about.feature5": "f5",
        "about.feature6": "f6",
        "about.feature7": "f7",
        "about.feature8": "f8",
        "about.feature9": "f9",
        "settings.selectLanguage": "Select Language",
      };
      return map[key] ?? key;
    },
    i18n: { language: "en", changeLanguage: vi.fn() },
  }),
  initReactI18next: { type: "3rdParty", init: vi.fn() },
}));

vi.mock("@/analytics", () => ({
  tracker: { trackPageView: vi.fn(), trackEvent: vi.fn() },
  AnalyticsEvents: {
    DEVICE_ID_COPIED: "device_id_copied",
    DISCORD_LINK_CLICKED: "discord_link_clicked",
    THEME_CHANGED: "theme_changed",
    LANGUAGE_CHANGED: "language_changed",
    GDPR_CONSENT_GIVEN: "gdpr_consent_given",
    GDPR_CONSENT_DECLINED: "gdpr_consent_declined",
  },
}));

vi.mock("@/services/apolloClient", () => ({
  apolloClient: {
    query: vi.fn(),
    mutate: vi.fn(),
    watchQuery: vi.fn(),
    cache: { readQuery: vi.fn(), writeQuery: vi.fn(), reset: vi.fn() },
    link: {},
    defaultOptions: {},
    queryDeduplication: false,
    typeDefs: undefined,
    resetStore: vi.fn(),
    clearStore: vi.fn(),
    stop: vi.fn(),
    reFetchObservableQueries: vi.fn(),
  },
}));

vi.mock("@apollo/client", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@apollo/client")>();
  return {
    ...actual,
    useQuery: vi.fn().mockReturnValue({ data: null, loading: false }),
    ApolloProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});

describe("App routing", () => {
  it("renders privacy page at /privacy", async () => {
    // Set the initial URL before importing App
    window.history.pushState({}, "", "/privacy");
    const { default: App } = await import("@/App");
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
    });
  });

  it("renders not found page for unknown routes", async () => {
    window.history.pushState({}, "", "/this-does-not-exist");
    const { default: App } = await import("@/App");
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText("Page Not Found")).toBeInTheDocument();
    });
  });

  it("renders header and footer in layout", async () => {
    window.history.pushState({}, "", "/about");
    const { default: App } = await import("@/App");
    const { container } = render(<App />);
    await waitFor(() => {
      expect(container.querySelector("header")).toBeInTheDocument();
      expect(container.querySelector("footer")).toBeInTheDocument();
    });
  });
});
