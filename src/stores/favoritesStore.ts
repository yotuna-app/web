import { create } from "zustand";
import { tracker, AnalyticsEvents } from "@/analytics";

const FAVORITES_KEY = "yotuna-favorites";

interface FavoriteStation {
  id: string;
  timestamp: number;
}

interface FavoritesState {
  favoriteStations: FavoriteStation[];
  addFavorite: (stationId: string, limit: number) => { success: boolean; error?: string };
  removeFavorite: (stationId: string) => void;
  isFavorite: (stationId: string) => boolean;
  getFavoriteIds: () => string[];
  getFavoritesCount: () => number;
}

function loadFavorites(): FavoriteStation[] {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveFavorites(favorites: FavoriteStation[]): void {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favoriteStations: loadFavorites(),

  addFavorite: (stationId, limit) => {
    const currentCount = get().favoriteStations.length;

    if (currentCount >= limit) {
      tracker.trackEvent(AnalyticsEvents.STATION_FAVORITE_FAILED, {
        stationId,
        reason: "limit_reached",
        currentCount,
      });
      return { success: false, error: "LIMIT_REACHED" };
    }

    const updated = [...get().favoriteStations, { id: stationId, timestamp: Date.now() }];
    saveFavorites(updated);
    set({ favoriteStations: updated });

    tracker.trackEvent(AnalyticsEvents.STATION_FAVORITE, {
      stationId,
      currentCount: currentCount + 1,
    });

    return { success: true };
  },

  removeFavorite: (stationId) => {
    const currentCount = get().favoriteStations.length;
    const updated = get().favoriteStations.filter((s) => s.id !== stationId);
    saveFavorites(updated);
    set({ favoriteStations: updated });

    tracker.trackEvent(AnalyticsEvents.STATION_UNFAVORITE, {
      stationId,
      currentCount: currentCount - 1,
    });
  },

  isFavorite: (stationId) => {
    return get().favoriteStations.some((s) => s.id === stationId);
  },

  getFavoriteIds: () => {
    return get()
      .favoriteStations.sort((a, b) => b.timestamp - a.timestamp)
      .map((s) => s.id);
  },

  getFavoritesCount: () => {
    return get().favoriteStations.length;
  },
}));
