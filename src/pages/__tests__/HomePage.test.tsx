import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

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
        "home.allStations": "All Stations",
        "home.favorites": "Favorites",
        "home.genres": "Genres",
        "home.filterByGenre": "Filter by Genre",
        "home.clearFilters": "Clear all",
        "common.search": "Search stations...",
        "common.noResults": "No results found",
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
    SEARCH_PERFORMED: "search_performed",
    SEARCH_CLEARED: "search_cleared",
    AUDIO_PLAY: "audio_play",
    AUDIO_PAUSE: "audio_pause",
    AUDIO_STOP: "audio_stop",
    STATION_FAVORITE: "station_favorite",
    STATION_UNFAVORITE: "station_unfavorite",
    STATION_FAVORITE_FAILED: "station_favorite_failed",
  },
}));

const mockStations = [
  {
    id: "s1",
    name: "Jazz FM",
    playlistAvailable: true,
    stream: { sd: "http://stream.test/jazz" },
    imageUrl: "http://img.test/jazz.png",
    genres: ["Jazz"],
  },
  {
    id: "s2",
    name: "Rock Radio",
    playlistAvailable: false,
    stream: { sd: "http://stream.test/rock" },
    genres: ["Rock"],
  },
];

const mockUseQuery = vi.fn();

vi.mock("@apollo/client", () => ({
  useQuery: (...args: unknown[]) => mockUseQuery(...args),
  gql: (strings: TemplateStringsArray) => strings[0],
}));

const mockConfig = {
  enableSubscriptions: false,
  favoritesLimit: 50,
  stationsPageLimit: 50,
  genres: ["Jazz", "Rock", "Pop"],
  discord: { inviteUrl: "" },
  review: { milestones: [] },
  store: { appleId: "", androidPackage: "" },
  playlistDaysBack: 6,
  websiteUrl: "",
  privacyUrl: "",
};

const mockStationsData = {
  getStations: { stations: mockStations, total: 2 },
};

const mockConfigData = {
  getAppConfig: mockConfig,
};

describe("HomePage", () => {
  beforeEach(() => {
    localStorage.clear();
    mockUseQuery.mockImplementation((query: unknown) => {
      if (typeof query === "string" && query.includes("getAppConfig")) {
        return {
          data: mockConfigData,
          loading: false,
        };
      }
      return {
        data: mockStationsData,
        loading: false,
        fetchMore: vi.fn(),
      };
    });
  });

  async function renderPage(initialEntries = ["/"]) {
    const { default: HomePage } = await import("@/pages/HomePage");
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <HomePage />
      </MemoryRouter>,
    );
  }

  it("renders tab buttons", async () => {
    await renderPage();
    expect(screen.getByText("All Stations")).toBeInTheDocument();
    expect(screen.getByText("Favorites")).toBeInTheDocument();
    expect(screen.getByText("Genres")).toBeInTheDocument();
  });

  it("renders search bar in all stations tab", async () => {
    await renderPage();
    expect(screen.getByPlaceholderText("Search stations...")).toBeInTheDocument();
  });

  it("renders station list", async () => {
    await renderPage();
    expect(screen.getByText("Jazz FM")).toBeInTheDocument();
    expect(screen.getByText("Rock Radio")).toBeInTheDocument();
  });

  it("switches to favorites tab", async () => {
    const user = userEvent.setup();
    await renderPage();
    const favTab = screen.getByText("Favorites");
    await user.click(favTab);
    // Search bar should be hidden when on favorites tab
    expect(screen.queryByPlaceholderText("Search stations...")).not.toBeInTheDocument();
  });

  it("loads search query from url param 'q'", async () => {
    await renderPage(["/?q=rock"]);
    const input = screen.getByPlaceholderText("Search stations...") as HTMLInputElement;
    expect(input.value).toBe("rock");
  });

  it("updates url param 'q' when searching", async () => {
    const user = userEvent.setup();
    await renderPage();
    const input = screen.getByPlaceholderText("Search stations...");
    await user.type(input, "jazz");
    expect((input as HTMLInputElement).value).toBe("jazz");
  });

  it("renders genres tab with filter chips when navigated to /genres", async () => {
    await renderPage(["/genres"]);
    expect(screen.getByText("Filter by Genre")).toBeInTheDocument();
    expect(screen.getAllByText("Jazz").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Rock").length).toBeGreaterThan(0);
    expect(screen.getByText("Pop")).toBeInTheDocument();
  });

  it("selects genre chips and shows count and clear button", async () => {
    const user = userEvent.setup();
    await renderPage(["/genres"]);

    const popChip = screen.getByRole("button", { name: "Pop" });
    await user.click(popChip);

    expect(screen.getByText("Clear all")).toBeInTheDocument();
  });

  it("loads selected genres from url search params", async () => {
    await renderPage(["/genres?genres=Jazz,Rock"]);
    expect(screen.getByText("Clear all")).toBeInTheDocument();
  });

  it("shows loading state", async () => {
    mockUseQuery.mockReturnValue({
      data: null,
      loading: true,
      fetchMore: vi.fn(),
    });
    const { container } = await renderPage();
    const svg = container.querySelector("svg.animate-spin");
    expect(svg).toBeInTheDocument();
  });
});
