import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// Mock i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        "nav.home": "Radio Stations",
        "nav.settings": "Settings",
        "nav.about": "About",
        "nav.privacy": "Privacy",
        "settings.selectLanguage": "Select Language",
      };
      return map[key] ?? key;
    },
    i18n: { language: "en", changeLanguage: vi.fn() },
  }),
}));

// Mock analytics
vi.mock("@/analytics", () => ({
  tracker: { trackEvent: vi.fn() },
  AnalyticsEvents: {},
}));

// Mock i18n module
vi.mock("@/i18n", () => ({
  default: { changeLanguage: vi.fn(), language: "en" },
  SUPPORTED_LANGUAGES: ["en", "pl", "de"],
  updateDocumentDirection: vi.fn(),
}));

describe("Header", async () => {
  const { default: Header } = await import("@/components/layout/Header");

  it("renders navigation links", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );
    expect(screen.getByText("Yotuna")).toBeInTheDocument();
    expect(screen.getByText("Radio Stations")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Privacy")).toBeInTheDocument();
  });

  it("renders theme and language switchers", () => {
    const { container } = render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );
    // ThemeSwitcher has 3 buttons (light/dark/system)
    const buttons = container.querySelectorAll("button");
    expect(buttons.length).toBeGreaterThanOrEqual(3);
  });
});

describe("Footer", async () => {
  const { default: Footer } = await import("@/components/layout/Footer");

  it("renders copyright", () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
    expect(screen.getByText(/Yotuna/)).toBeInTheDocument();
  });

  it("renders website link", () => {
    render(<Footer />);
    const link = screen.getByText("yotuna.com");
    expect(link).toHaveAttribute("href", "https://yotuna.com");
    expect(link).toHaveAttribute("target", "_blank");
  });
});

describe("Layout", async () => {
  const { default: Layout } = await import("@/components/layout/Layout");

  it("renders header and footer with outlet area", () => {
    const { container } = render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>,
    );
    // Should have header, main, and footer
    expect(container.querySelector("header")).toBeInTheDocument();
    expect(container.querySelector("main")).toBeInTheDocument();
    expect(container.querySelector("footer")).toBeInTheDocument();
  });
});

describe("ThemeSwitcher", async () => {
  const { default: ThemeSwitcher } = await import("@/components/layout/ThemeSwitcher");

  it("renders 3 theme buttons", () => {
    const { container } = render(<ThemeSwitcher />);
    const buttons = container.querySelectorAll("button");
    expect(buttons).toHaveLength(3);
  });
});
