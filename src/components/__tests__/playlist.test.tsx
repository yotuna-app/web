import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import PlaylistImage from "@/components/playlist/PlaylistImage";
import StreamingButtons from "@/components/playlist/StreamingButtons";
import type { PlaylistTrack } from "@/types";

// Mock analytics
vi.mock("@/analytics", () => ({
  tracker: { trackEvent: vi.fn() },
  AnalyticsEvents: { STREAMING_LINK_CLICKED: "streaming_link_clicked" },
}));

// Mock i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        "station.openInDeezer": "Deezer",
        "station.openInTidal": "Tidal",
        "station.openInSpotify": "Spotify",
        "station.openInAppleMusic": "Apple Music",
      };
      return map[key] ?? key;
    },
    i18n: { language: "en" },
  }),
}));

const trackWithStreaming: PlaylistTrack = {
  startedAt: "2025-01-15T14:00:00Z",
  title: "Take Five",
  artists: "Dave Brubeck",
  album: "Time Out",
  imageUrl: "http://img.test/track.jpg",
  deezerTrackId: "123",
  spotifyTrackId: "456",
  tidalTrackId: "789",
  appleTrackId: "012",
};

const trackWithoutStreaming: PlaylistTrack = {
  startedAt: "2025-01-15T14:05:00Z",
  title: "Unknown Song",
  artists: "Unknown Artist",
};

describe("PlaylistImage", () => {
  it("renders image when imageUrl is provided", () => {
    render(<PlaylistImage imageUrl="http://img.test/track.jpg" title="Take Five" />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "http://img.test/track.jpg");
  });

  it("renders music icon fallback when no imageUrl", () => {
    const { container } = render(<PlaylistImage title="No Image" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});

describe("StreamingButtons", () => {
  it("renders buttons for all available services", () => {
    render(<StreamingButtons track={trackWithStreaming} />);
    expect(screen.getByText("Deezer")).toBeInTheDocument();
    expect(screen.getByText("Spotify")).toBeInTheDocument();
    expect(screen.getByText("Tidal")).toBeInTheDocument();
    expect(screen.getByText("Apple Music")).toBeInTheDocument();
  });

  it("renders nothing when no streaming IDs available", () => {
    const { container } = render(<StreamingButtons track={trackWithoutStreaming} />);
    expect(container.innerHTML).toBe("");
  });

  it("only renders buttons for services with track IDs", () => {
    const partialTrack: PlaylistTrack = {
      ...trackWithoutStreaming,
      spotifyTrackId: "abc",
    };
    render(<StreamingButtons track={partialTrack} />);
    expect(screen.getByText("Spotify")).toBeInTheDocument();
    expect(screen.queryByText("Deezer")).not.toBeInTheDocument();
    expect(screen.queryByText("Tidal")).not.toBeInTheDocument();
  });

  it("applies brand colors to buttons", () => {
    render(<StreamingButtons track={trackWithStreaming} />);
    const spotifyButton = screen.getByText("Spotify");
    expect(spotifyButton).toHaveStyle({ backgroundColor: "#1DB954" });
  });
});
