import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@apollo/client";
import { useFocusable, FocusContext } from "@noriginmedia/norigin-spatial-navigation";
import { Star, Radio } from "lucide-react";
import { GET_STATIONS, GET_FAVORITE_STATIONS, GET_APP_CONFIG } from "@/graphql";
import { useConfigStore, useFavoritesStore } from "@/stores";
import { tracker } from "@/analytics";
import StationList from "../components/station/StationList";
import type { TVPage } from "../navigation";
import type { Station, StationsResponse, FavoriteStationsResponse, AppConfigResponse } from "@/types";

type Tab = "all" | "favorites";

interface HomePageProps {
  onNavigate: (page: TVPage, params?: Record<string, string>) => void;
}

// Child component — registers under HomePage's FocusContext
function TabButton({ icon, label, isActive, onPress, badge }: {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onPress: () => void;
  badge?: number;
}) {
  const { ref, focused } = useFocusable({
    onEnterPress: onPress,
  });

  return (
    <div
      ref={ref}
      onClick={onPress}
      className={`flex items-center gap-3 rounded-tv-md px-tv-3 py-tv-2 tv-btn-focus cursor-pointer ${
        isActive ? "bg-primary-600 text-white" : "text-gray-400"
      } ${focused ? "focused" : ""}`}
    >
      {icon}
      <span className="text-tv-sm font-medium">{label}</span>
      {badge != null && badge > 0 && (
        <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-primary-800 px-2 text-tv-xs font-semibold text-white">
          {badge}
        </span>
      )}
    </div>
  );
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const { t } = useTranslation();
  const { setConfig } = useConfigStore();
  const { getFavoriteIds, getFavoritesCount } = useFavoritesStore();

  const [tab, setTab] = useState<Tab>("all");

  const { ref: containerRef, focusKey, focusSelf } = useFocusable({
    isFocusBoundary: false,
    focusable: true,
  });

  // Focus this page when it mounts
  useEffect(() => {
    focusSelf();
  }, [focusSelf]);

  // Fetch app config
  const { data: configData } = useQuery<AppConfigResponse>(GET_APP_CONFIG);
  useEffect(() => {
    if (configData?.getAppConfig) {
      setConfig(configData.getAppConfig);
    }
  }, [configData, setConfig]);

  // Fetch all stations (load all at once for TV - no infinite scroll)
  const { data: stationsData, loading: stationsLoading } = useQuery<StationsResponse>(GET_STATIONS, {
    variables: { query: "", offset: 0, limit: 200 },
  });

  const stations = stationsData?.getStations?.stations ?? [];

  // Fetch favorite stations
  const favoriteIds = getFavoriteIds();
  const { data: favData, loading: favLoading } = useQuery<FavoriteStationsResponse>(GET_FAVORITE_STATIONS, {
    variables: { stationIds: favoriteIds },
    skip: favoriteIds.length === 0,
  });

  const favoriteStations = favData?.getStationsById?.stations ?? [];

  useEffect(() => {
    tracker.trackPageView("tv_home");
  }, []);

  const handleSelectStation = useCallback(
    (station: Station) => {
      onNavigate("station", { name: station.name });
    },
    [onNavigate],
  );

  const favCount = getFavoritesCount();

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={containerRef} className="flex h-full flex-col p-tv-4">
        {/* Tab bar — child components register under this page's FocusContext */}
        <div className="mb-tv-4 flex items-center gap-tv-3">
          <TabButton
            icon={<Radio className="h-7 w-7" />}
            label={t("home.allStations")}
            isActive={tab === "all"}
            onPress={() => setTab("all")}
          />
          <TabButton
            icon={<Star className="h-7 w-7" />}
            label={t("home.favorites")}
            isActive={tab === "favorites"}
            onPress={() => setTab("favorites")}
            badge={favCount}
          />
        </div>

        {/* Station list */}
        <div className="flex-1 overflow-y-auto">
          {tab === "all" ? (
            <StationList stations={stations} loading={stationsLoading} onSelectStation={handleSelectStation} />
          ) : (
            <StationList
              stations={favoriteStations}
              loading={favLoading}
              emptyMessage={t("common.noResults")}
              onSelectStation={handleSelectStation}
            />
          )}
        </div>
      </div>
    </FocusContext.Provider>
  );
}
