import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import StationImage from "@/components/station/StationImage";
import StationCard from "@/components/station/StationCard";
import FavoriteButton from "@/components/station/FavoriteButton";
import StationList from "@/components/station/StationList";
import type { Station } from "@/types";

// Mock analytics
vi.mock("@/analytics", () => ({
  tracker: { trackEvent: vi.fn() },
  AnalyticsEvents: {
    AUDIO_PLAY: "audio_play",
    AUDIO_PAUSE: "audio_pause",
    STATION_FAVORITE: "station_favorite",
    STATION_UNFAVORITE: "station_unfavorite",
    STATION_FAVORITE_FAILED: "station_favorite_failed",
  },
}));

// Mock i18n module to prevent real initialization
vi.mock("@/i18n", () => ({
  default: {
    changeLanguage: vi.fn(),
    language: "en",
    on: vi.fn(),
  },
  updateDocumentDirection: vi.fn(),
  SUPPORTED_LANGUAGES: ["en", "pl", "de", "fr", "es", "ar", "zh", "hi", "ja"] as const,
  RTL_LANGUAGES: ["ar"],
}));

// Mock i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "en" },
  }),
  initReactI18next: {
    type: "3rdParty",
    init: vi.fn(),
  },
}));

const mockStation: Station = {
  id: "station-1",
  name: "Jazz FM",
  playlistAvailable: true,
  stream: { sd: "http://stream.test/jazz" },
  imageUrl: "http://img.test/jazz.png",
  genres: ["Jazz", "Blues", "Soul"],
};

describe("StationImage", () => {
  it("renders fallback letter when no imageUrl", () => {
    render(<StationImage name="Jazz FM" size="md" />);
    expect(screen.getByText("J")).toBeInTheDocument();
  });

  it("renders fallback letter when imageUrl is empty", () => {
    render(<StationImage imageUrl="" name="Rock Radio" size="sm" />);
    expect(screen.getByText("R")).toBeInTheDocument();
  });

  it("renders image when imageUrl is provided", () => {
    render(<StationImage imageUrl="http://img.test/pic.png" name="Test" size="md" />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "http://img.test/pic.png");
    expect(img).toHaveAttribute("alt", "Test");
  });
});

describe("StationCard", () => {
  it("renders station name", () => {
    render(
      <MemoryRouter>
        <StationCard station={mockStation} />
      </MemoryRouter>,
    );
    expect(screen.getByText("Jazz FM")).toBeInTheDocument();
  });

  it("renders genres", () => {
    render(
      <MemoryRouter>
        <StationCard station={mockStation} />
      </MemoryRouter>,
    );
    expect(screen.getByText("Jazz")).toBeInTheDocument();
    expect(screen.getByText("Blues")).toBeInTheDocument();
    expect(screen.getByText("Soul")).toBeInTheDocument();
  });

  it("limits genres to 3", () => {
    const stationWithManyGenres: Station = {
      ...mockStation,
      genres: ["Jazz", "Blues", "Soul", "Funk", "R&B"],
    };
    render(
      <MemoryRouter>
        <StationCard station={stationWithManyGenres} />
      </MemoryRouter>,
    );
    expect(screen.getByText("Jazz")).toBeInTheDocument();
    expect(screen.queryByText("Funk")).not.toBeInTheDocument();
  });
});

describe("FavoriteButton", () => {
  it("renders a heart icon button", () => {
    render(<FavoriteButton stationId="station-1" />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    const svg = button.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});

describe("StationList", () => {
  it("renders station cards", () => {
    render(
      <MemoryRouter>
        <StationList stations={[mockStation]} />
      </MemoryRouter>,
    );
    expect(screen.getByText("Jazz FM")).toBeInTheDocument();
  });

  it("shows empty message when no stations", () => {
    render(
      <MemoryRouter>
        <StationList stations={[]} emptyMessage="No stations" />
      </MemoryRouter>,
    );
    expect(screen.getByText("No stations")).toBeInTheDocument();
  });

  it("shows loader when loading", () => {
    const { container } = render(
      <MemoryRouter>
        <StationList stations={[]} loading={true} />
      </MemoryRouter>,
    );
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});
