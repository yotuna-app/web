import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

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
        "about.title": "About Yotuna",
        "about.description": "Your radio companion.",
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
        "about.version": "Version",
        "about.feature1": "Live radio streaming",
        "about.feature2": "Playlist tracking",
        "about.feature3": "Music discovery",
        "about.feature4": "Streaming links",
        "about.feature5": "Favorites",
        "about.feature6": "Dark mode",
        "about.feature7": "Timezone support",
        "about.feature8": "Copy to clipboard",
        "about.feature9": "Mobile apps",
        "common.copiedToClipboard": "Copied!",
      };
      return map[key] ?? key;
    },
    i18n: { language: "en" },
  }),
  initReactI18next: { type: "3rdParty", init: vi.fn() },
}));

vi.mock("@/analytics", () => ({
  tracker: { trackPageView: vi.fn(), trackEvent: vi.fn() },
  AnalyticsEvents: {
    DEVICE_ID_COPIED: "device_id_copied",
    DISCORD_LINK_CLICKED: "discord_link_clicked",
  },
}));

describe("AboutPage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  async function renderPage() {
    const { default: AboutPage } = await import("@/pages/AboutPage");
    return render(<AboutPage />);
  }

  it("renders the title", async () => {
    await renderPage();
    expect(screen.getByText("About Yotuna")).toBeInTheDocument();
  });

  it("renders description", async () => {
    await renderPage();
    expect(screen.getByText("Your radio companion.")).toBeInTheDocument();
  });

  it("renders version number", async () => {
    await renderPage();
    expect(screen.getByText(/1\.0\.7/)).toBeInTheDocument();
  });

  it("renders features section", async () => {
    await renderPage();
    expect(screen.getByText("Features")).toBeInTheDocument();
    expect(screen.getByText("Live radio streaming")).toBeInTheDocument();
    expect(screen.getByText("Playlist tracking")).toBeInTheDocument();
  });

  it("renders technology section", async () => {
    await renderPage();
    expect(screen.getByText("Technology")).toBeInTheDocument();
    expect(screen.getByText("React 19")).toBeInTheDocument();
    expect(screen.getByText("Vite 7")).toBeInTheDocument();
    expect(screen.getByText("Tailwind CSS v4")).toBeInTheDocument();
  });

  it("renders community section with Discord link", async () => {
    await renderPage();
    expect(screen.getByText("Community")).toBeInTheDocument();
    expect(screen.getByText("Join Discord")).toBeInTheDocument();
    const discordLink = screen.getByText("Join Discord");
    expect(discordLink.closest("a")).toHaveAttribute("href", "https://discord.gg/mrGKWMSTs2");
  });

  it("renders mobile apps links", async () => {
    await renderPage();
    expect(screen.getByText("Mobile Apps")).toBeInTheDocument();
    expect(screen.getByText("App Store")).toBeInTheDocument();
    expect(screen.getByText("Google Play")).toBeInTheDocument();
  });

  it("renders device info section", async () => {
    await renderPage();
    expect(screen.getByText("Device Info")).toBeInTheDocument();
    expect(screen.getByText("Device ID")).toBeInTheDocument();
  });

  it("copies device ID to clipboard on click", async () => {
    const user = userEvent.setup();
    const { useDeviceStore } = await import("@/stores");
    useDeviceStore.setState({ deviceId: "test-device-id-123" });
    await renderPage();

    const deviceIdButton = screen.getByText("test-device-id-123");
    // Spy on clipboard.writeText after userEvent.setup() has installed its own clipboard
    const writeTextSpy = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);
    await user.click(deviceIdButton);
    expect(writeTextSpy).toHaveBeenCalledWith("test-device-id-123");
    writeTextSpy.mockRestore();
  });

  it("tracks page view on mount", async () => {
    const { tracker } = await import("@/analytics");
    const mockedTrackPageView = vi.mocked(tracker.trackPageView);
    mockedTrackPageView.mockClear();
    await renderPage();
    expect(mockedTrackPageView).toHaveBeenCalledWith("about");
  });
});
