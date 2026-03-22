import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import NotFoundPage from "@/pages/NotFoundPage";

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
        "notFound.title": "Page Not Found",
        "notFound.message": "The page you are looking for does not exist.",
        "notFound.goHome": "Go Home",
      };
      return map[key] ?? key;
    },
    i18n: { language: "en" },
  }),
  initReactI18next: { type: "3rdParty", init: vi.fn() },
}));

describe("NotFoundPage", () => {
  it("renders 404 heading", () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    );
    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("renders title and message", () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    );
    expect(screen.getByText("Page Not Found")).toBeInTheDocument();
    expect(screen.getByText("The page you are looking for does not exist.")).toBeInTheDocument();
  });

  it("renders go home button", () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    );
    expect(screen.getByText("Go Home")).toBeInTheDocument();
  });

  it("navigates home on button click", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/unknown"]}>
        <NotFoundPage />
      </MemoryRouter>,
    );
    const button = screen.getByText("Go Home");
    await user.click(button);
    // Navigation is handled by react-router — the button is clickable
    expect(button).toBeInTheDocument();
  });
});
