import { describe, it, expect, beforeEach, vi } from "vitest";
import { useFavoritesStore } from "@/stores/favoritesStore";

// Mock analytics
vi.mock("@/analytics", () => ({
  tracker: { trackEvent: vi.fn() },
  AnalyticsEvents: {
    STATION_FAVORITE: "station_favorite",
    STATION_UNFAVORITE: "station_unfavorite",
    STATION_FAVORITE_FAILED: "station_favorite_failed",
  },
}));

describe("favoritesStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useFavoritesStore.setState({ favoriteStations: [] });
  });

  it("starts with no favorites", () => {
    expect(useFavoritesStore.getState().getFavoritesCount()).toBe(0);
  });

  it("adds a favorite station", () => {
    const result = useFavoritesStore.getState().addFavorite("station-1", 50);
    expect(result.success).toBe(true);
    expect(useFavoritesStore.getState().isFavorite("station-1")).toBe(true);
    expect(useFavoritesStore.getState().getFavoritesCount()).toBe(1);
  });

  it("removes a favorite station", () => {
    useFavoritesStore.getState().addFavorite("station-1", 50);
    useFavoritesStore.getState().removeFavorite("station-1");
    expect(useFavoritesStore.getState().isFavorite("station-1")).toBe(false);
    expect(useFavoritesStore.getState().getFavoritesCount()).toBe(0);
  });

  it("respects the favorites limit", () => {
    useFavoritesStore.getState().addFavorite("s1", 2);
    useFavoritesStore.getState().addFavorite("s2", 2);
    const result = useFavoritesStore.getState().addFavorite("s3", 2);
    expect(result.success).toBe(false);
    expect(result.error).toBe("LIMIT_REACHED");
    expect(useFavoritesStore.getState().getFavoritesCount()).toBe(2);
  });

  it("persists favorites to localStorage", () => {
    useFavoritesStore.getState().addFavorite("station-1", 50);
    const stored = JSON.parse(localStorage.getItem("yotuna-favorites")!);
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe("station-1");
  });

  it("returns favorite IDs sorted by timestamp (newest first)", () => {
    vi.spyOn(Date, "now").mockReturnValueOnce(1000).mockReturnValueOnce(2000);
    useFavoritesStore.getState().addFavorite("s1", 50);
    useFavoritesStore.getState().addFavorite("s2", 50);
    const ids = useFavoritesStore.getState().getFavoriteIds();
    expect(ids[0]).toBe("s2");
    expect(ids[1]).toBe("s1");
    vi.restoreAllMocks();
  });

  it("isFavorite returns false for non-existent station", () => {
    expect(useFavoritesStore.getState().isFavorite("nonexistent")).toBe(false);
  });
});
