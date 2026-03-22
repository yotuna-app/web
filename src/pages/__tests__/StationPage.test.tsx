import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

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
        "common.noResults": "Station not found",
        "station.backToStations": "Back to Stations",
        "station.playlist": "Playlist",
        "station.noPlaylistData": "No playlist data",
        "station.playlistNotAvailable": "Playlist not available",
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
    STATION_DETAILS_VIEW: "station_details_view",
    AUDIO_PLAY: "audio_play",
    AUDIO_PAUSE: "audio_pause",
    AUDIO_STOP: "audio_stop",
    STATION_FAVORITE: "station_favorite",
    STATION_UNFAVORITE: "station_unfavorite",
    STATION_FAVORITE_FAILED: "station_favorite_failed",
    SOCIAL_LINK_CLICKED: "social_link_clicked",
    STREAMING_LINK_CLICKED: "streaming_link_clicked",
  },
}));

const mockStation = {
  id: "station-1",
  name: "Jazz FM",
  playlistAvailable: true,
  stream: { sd: "http://stream.test/jazz" },
  imageUrl: "http://img.test/jazz.png",
  genres: ["Jazz", "Blues"],
};

const mockTracks = [
  {
    startedAt: "2025-01-15T14:00:00Z",
    title: "Take Five",
    artists: "Dave Brubeck",
    album: "Time Out",
  },
];

const mockUseQuery = vi.fn();

vi.mock("@apollo/client", () => ({
  useQuery: (...args: unknown[]) => mockUseQuery(...args),
  gql: (strings: TemplateStringsArray) => strings[0],
}));

describe("StationPage", () => {
  beforeEach(() => {
    localStorage.clear();
    mockUseQuery.mockImplementation((_query: unknown, options?: { variables?: { stationId?: string } }) => {
      if (options?.variables?.stationId) {
        // Playlist query
        return {
          data: { getStationPlaylist: { entries: mockTracks } },
          loading: false,
        };
      }
      // Station query
      return {
        data: { getStations: { stations: [mockStation], total: 1 } },
        loading: false,
      };
    });
  });

  async function renderPage(stationName = "Jazz FM") {
    const { default: StationPage } = await import("@/pages/StationPage");
    return render(
      <MemoryRouter initialEntries={[`/station/${encodeURIComponent(stationName)}`]}>
        <Routes>
          <Route path="/station/:name" element={<StationPage />} />
        </Routes>
      </MemoryRouter>,
    );
  }

  it("renders station name", async () => {
    await renderPage();
    expect(screen.getByText("Jazz FM")).toBeInTheDocument();
  });

  it("renders genres", async () => {
    await renderPage();
    expect(screen.getByText("Jazz")).toBeInTheDocument();
    expect(screen.getByText("Blues")).toBeInTheDocument();
  });

  it("renders back button", async () => {
    await renderPage();
    expect(screen.getByText("Back to Stations")).toBeInTheDocument();
  });

  it("renders playlist section", async () => {
    await renderPage();
    expect(screen.getByText("Playlist")).toBeInTheDocument();
  });

  it("shows station not found when no station data", async () => {
    mockUseQuery.mockReturnValue({
      data: { getStations: { stations: [], total: 0 } },
      loading: false,
    });
    await renderPage("nonexistent");
    expect(screen.getByText("Station not found")).toBeInTheDocument();
  });

  it("shows loading state", async () => {
    mockUseQuery.mockReturnValue({ data: null, loading: true });
    const { container } = await renderPage();
    const svg = container.querySelector("svg.animate-spin");
    expect(svg).toBeInTheDocument();
  });

  it("shows playlist not available message", async () => {
    const stationWithoutPlaylist = { ...mockStation, playlistAvailable: false };
    mockUseQuery.mockReturnValue({
      data: { getStations: { stations: [stationWithoutPlaylist], total: 1 } },
      loading: false,
    });
    await renderPage();
    expect(screen.getByText("Playlist not available")).toBeInTheDocument();
  });
});
