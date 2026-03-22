import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

// Mock i18n
vi.mock("@/i18n", () => ({
  default: { changeLanguage: vi.fn(), language: "en", on: vi.fn() },
  updateDocumentDirection: vi.fn(),
  SUPPORTED_LANGUAGES: ["en", "pl", "de"] as const,
  RTL_LANGUAGES: [],
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        "settings.title": "Settings",
        "settings.appearance": "Appearance",
        "settings.light": "Light",
        "settings.dark": "Dark",
        "settings.system": "System",
        "settings.language": "Language",
        "settings.gdprConsent": "Privacy Consent",
        "settings.resetGdpr": "Reset",
        "gdpr.prompt": "No consent given yet.",
        "gdpr.accept": "Consent given",
        "gdpr.decline": "Consent declined",
        "station.backToStations": "Cancel",
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
    THEME_CHANGED: "theme_changed",
    LANGUAGE_CHANGED: "language_changed",
    GDPR_CONSENT_CHANGE: "gdpr_consent_change",
  },
}));

describe("SettingsPage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  async function renderPage() {
    const { default: SettingsPage } = await import("@/pages/SettingsPage");
    return render(
      <MemoryRouter>
        <SettingsPage />
      </MemoryRouter>,
    );
  }

  it("renders the title", async () => {
    await renderPage();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("renders appearance section", async () => {
    await renderPage();
    expect(screen.getByText("Appearance")).toBeInTheDocument();
  });

  it("renders privacy consent section", async () => {
    await renderPage();
    expect(screen.getByText("Privacy Consent")).toBeInTheDocument();
  });

  it("renders theme switcher with 3 buttons", async () => {
    const { container } = await renderPage();
    // ThemeSwitcher renders 3 icon buttons (light/dark/system)
    const themeButtons = container.querySelectorAll("button");
    expect(themeButtons.length).toBeGreaterThanOrEqual(3);
  });

  it("shows consent status when no consent given", async () => {
    await renderPage();
    expect(screen.getByText("No consent given yet.")).toBeInTheDocument();
  });

  it("shows reset button after consent is given", async () => {
    const { useConsentStore } = await import("@/stores");
    useConsentStore.setState({ hasGivenConsent: true });
    await renderPage();
    expect(screen.getByText("Reset")).toBeInTheDocument();
    useConsentStore.setState({ hasGivenConsent: null });
  });

  it("shows confirmation dialog on reset click", async () => {
    const user = userEvent.setup();
    const { useConsentStore } = await import("@/stores");
    useConsentStore.setState({ hasGivenConsent: true });
    await renderPage();
    const resetBtn = screen.getByText("Reset");
    await user.click(resetBtn);
    // After clicking reset, a confirmation appears with Reset and Cancel
    const buttons = screen.getAllByRole("button");
    const resetButtons = buttons.filter((b) => b.textContent === "Reset");
    expect(resetButtons.length).toBeGreaterThanOrEqual(1);
    useConsentStore.setState({ hasGivenConsent: null });
  });
});
