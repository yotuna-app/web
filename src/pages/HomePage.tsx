import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@apollo/client";
import { Star, Radio } from "lucide-react";
import { GET_STATIONS, GET_FAVORITE_STATIONS, GET_APP_CONFIG } from "@/graphql/queries";
import { useConfigStore, useFavoritesStore, useAudioStore } from "@/stores";
import { tracker, AnalyticsEvents } from "@/analytics";
import SearchBar from "@/components/common/SearchBar";
import StationList from "@/components/station/StationList";
import AudioPlayerBar from "@/components/common/AudioPlayerBar";
import type { StationsResponse, FavoriteStationsResponse, AppConfigResponse } from "@/types";

type Tab = "all" | "favorites";

export default function HomePage() {
  const { t } = useTranslation();
  const { appConfig, setConfig } = useConfigStore();
  const { getFavoriteIds, getFavoritesCount } = useFavoritesStore();
  const { currentStationId } = useAudioStore();

  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<Tab>("all");
  const [offset, setOffset] = useState(0);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Fetch app config
  const { data: configData } = useQuery<AppConfigResponse>(GET_APP_CONFIG);
  useEffect(() => {
    if (configData?.getAppConfig) {
      setConfig(configData.getAppConfig);
    }
  }, [configData, setConfig]);

  // Fetch all stations
  const {
    data: stationsData,
    loading: stationsLoading,
    fetchMore,
  } = useQuery<StationsResponse>(GET_STATIONS, {
    variables: { query: search, offset: 0, limit: appConfig.stationsPageLimit },
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
    tracker.trackPageView("home");
  }, []);

  // Reset offset when search changes
  useEffect(() => {
    setOffset(0);
  }, [search]);

  const handleSearch = useCallback(
    (value: string) => {
      setSearch(value);
      if (value.length > 0) {
        tracker.trackEvent(AnalyticsEvents.SEARCH_PERFORMED, { query: value });
      } else {
        tracker.trackEvent(AnalyticsEvents.SEARCH_CLEARED);
      }
    },
    [],
  );

  function handleLoadMore() {
    if (!hasMore || stationsLoading) return;
    const newOffset = offset + appConfig.stationsPageLimit;
    setOffset(newOffset);
    fetchMore({
      variables: { offset: newOffset },
    });
  }

  // Infinite scroll observer
  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || tab !== "all") return;

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
  }, [hasMore, stationsLoading, offset, tab]);

  const favCount = getFavoritesCount();

  return (
    <div className={`space-y-4 ${currentStationId ? "pb-20" : ""}`}>
      {/* Search + Tab bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab("all")}
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
            onClick={() => setTab("favorites")}
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
        </div>

        {tab === "all" && (
          <div className="w-full sm:max-w-xs">
            <SearchBar value={search} onChange={handleSearch} placeholder={t("common.search")} />
          </div>
        )}
      </div>

      {/* Station list */}
      {tab === "all" ? (
        <>
          <StationList
            stations={stations}
            loading={stationsLoading && stations.length === 0}
            emptyMessage={search ? t("common.noResults") : undefined}
          />
          {hasMore && <div ref={loadMoreRef} className="h-1" />}
        </>
      ) : (
        <StationList
          stations={favoriteStations}
          loading={favLoading}
          emptyMessage={t("common.noResults")}
        />
      )}

      <AudioPlayerBar />
    </div>
  );
}
