import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Star, Radio, Tag } from "lucide-react";
import { GET_STATIONS, GET_FAVORITE_STATIONS, GET_APP_CONFIG } from "@/graphql/queries";
import { useConfigStore, useFavoritesStore, useAudioStore } from "@/stores";
import { tracker, AnalyticsEvents } from "@/analytics";
import SearchBar from "@/components/common/SearchBar";
import GenreFilter from "@/components/genre/GenreFilter";
import StationList from "@/components/station/StationList";
import AudioPlayerBar from "@/components/common/AudioPlayerBar";
import type { StationsResponse, FavoriteStationsResponse, AppConfigResponse } from "@/types";

type Tab = "all" | "favorites" | "genres";

export default function HomePage() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { appConfig, setConfig } = useConfigStore();
  const { getFavoriteIds, getFavoritesCount } = useFavoritesStore();
  const { currentStationId } = useAudioStore();

  const queryParam = searchParams.get("q") ?? "";
  const [search, setSearch] = useState(queryParam);
  const tab: Tab = location.pathname === "/favorites" ? "favorites" : location.pathname === "/genres" ? "genres" : "all";
  const [offset, setOffset] = useState(0);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Sync internal search state when URL searchParams change (e.g., navigating back)
  useEffect(() => {
    setSearch(queryParam);
  }, [queryParam]);

  // Read selected genres from searchParams (e.g. ?genres=Pop,Rock)
  const selectedGenres = useMemo(() => {
    const raw = searchParams.get("genres");
    if (!raw) return [];
    return raw
      .split(",")
      .map((g) => g.trim())
      .filter((g) => g.length > 0);
  }, [searchParams]);

  // Fetch app config
  const { data: configData } = useQuery<AppConfigResponse>(GET_APP_CONFIG);
  useEffect(() => {
    if (configData?.getAppConfig) {
      setConfig(configData.getAppConfig);
    }
  }, [configData, setConfig]);

  // Fetch stations (used for 'all' and 'genres' tabs)
  const queryGenres = tab === "genres" && selectedGenres.length > 0 ? selectedGenres : undefined;
  const {
    data: stationsData,
    loading: stationsLoading,
    fetchMore,
  } = useQuery<StationsResponse>(GET_STATIONS, {
    variables: {
      query: search,
      offset: 0,
      limit: appConfig.stationsPageLimit,
      genres: queryGenres,
    },
    notifyOnNetworkStatusChange: true,
  });

  const stations = stationsData?.getStations?.stations ?? [];
  const total = stationsData?.getStations?.total ?? 0;
  const hasMore = stations.length < total;

  // Fetch favorite stations
  const favoriteIds = getFavoriteIds();
  const { data: favData, loading: favLoading } = useQuery<FavoriteStationsResponse>(GET_FAVORITE_STATIONS, {
    variables: { stationIds: favoriteIds },
    skip: favoriteIds.length === 0,
  });

  const favoriteStations = favData?.getStationsById?.stations ?? [];

  useEffect(() => {
    tracker.trackPageView(tab === "genres" ? "genres" : tab === "favorites" ? "favorites" : "home");
  }, [tab]);

  const handleSearch = useCallback(
    (value: string) => {
      setSearch(value);
      setOffset(0);

      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value.trim()) {
            next.set("q", value);
          } else {
            next.delete("q");
          }
          return next;
        },
        { replace: true },
      );

      if (value.length > 0) {
        tracker.trackEvent(AnalyticsEvents.SEARCH_PERFORMED, { query: value });
      } else {
        tracker.trackEvent(AnalyticsEvents.SEARCH_CLEARED);
      }
    },
    [setSearchParams],
  );

  const handleToggleGenre = useCallback(
    (genre: string) => {
      setOffset(0);
      const isSelected = selectedGenres.includes(genre);
      const nextGenres = isSelected ? selectedGenres.filter((g) => g !== genre) : [...selectedGenres, genre];

      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (nextGenres.length === 0) {
            next.delete("genres");
          } else {
            next.set("genres", nextGenres.join(","));
          }
          return next;
        },
        { replace: true },
      );
    },
    [selectedGenres, setSearchParams],
  );

  const handleClearGenres = useCallback(() => {
    setOffset(0);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("genres");
        return next;
      },
      { replace: true },
    );
  }, [setSearchParams]);

  const handleLoadMore = useCallback(() => {
    if (!hasMore || stationsLoading) return;
    const newOffset = offset + appConfig.stationsPageLimit;
    setOffset(newOffset);
    fetchMore({
      variables: { offset: newOffset },
    });
  }, [hasMore, stationsLoading, offset, appConfig.stationsPageLimit, fetchMore]);

  // Infinite scroll observer
  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || tab === "favorites") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMore, handleLoadMore, tab]);

  const favCount = getFavoritesCount();
  const availableGenres = appConfig.genres ?? [];

  return (
    <div className={`space-y-4 ${currentStationId ? "pb-20" : ""}`}>
      {/* Search + Tab bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate("/")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              tab === "all"
                ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            <Radio className="h-4 w-4" />
            {t("home.allStations")}
          </button>
          <button
            onClick={() => navigate("/favorites")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              tab === "favorites"
                ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            <Star className="h-4 w-4" />
            {t("home.favorites")}
            {favCount > 0 && (
              <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-100 px-1.5 text-xs font-semibold text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                {favCount}
              </span>
            )}
          </button>
          <button
            onClick={() => navigate("/genres")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              tab === "genres"
                ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            <Tag className="h-4 w-4" />
            {t("home.genres")}
            {selectedGenres.length > 0 && (
              <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-100 px-1.5 text-xs font-semibold text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                {selectedGenres.length}
              </span>
            )}
          </button>
        </div>

        {tab !== "favorites" && (
          <div className="w-full sm:max-w-xs">
            <SearchBar value={search} onChange={handleSearch} placeholder={t("common.search")} />
          </div>
        )}
      </div>

      {/* Genres filter bar when in genres tab */}
      {tab === "genres" && (
        <GenreFilter
          genres={availableGenres}
          selectedGenres={selectedGenres}
          onToggleGenre={handleToggleGenre}
          onClearGenres={handleClearGenres}
        />
      )}

      {/* Station list */}
      {tab === "all" ? (
        <>
          <StationList
            stations={stations}
            loading={stationsLoading && stations.length === 0}
            emptyMessage={search ? t("common.noResults") : undefined}
            from="all"
          />
          {hasMore && <div ref={loadMoreRef} className="h-1" />}
        </>
      ) : tab === "genres" ? (
        <>
          <StationList
            stations={stations}
            loading={stationsLoading && stations.length === 0}
            emptyMessage={t("common.noResults")}
            from="genres"
          />
          {hasMore && <div ref={loadMoreRef} className="h-1" />}
        </>
      ) : (
        <StationList
          stations={favoriteStations}
          loading={favLoading}
          emptyMessage={t("common.noResults")}
          from="favorites"
        />
      )}

      <AudioPlayerBar />
    </div>
  );
}
