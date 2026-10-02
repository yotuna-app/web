import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@apollo/client";
import { useFocusable, FocusContext } from "@noriginmedia/norigin-spatial-navigation";
import { ArrowLeft, ListMusic } from "lucide-react";
import { GET_STATIONS, GET_STATION_PLAYLIST } from "@/graphql";
import { tracker, AnalyticsEvents } from "@/analytics";
import { getPlaylistDateRange } from "@/utils/dates";
import StationImage from "../components/station/StationImage";
import SocialLinks from "../components/station/SocialLinks";
import PlayButton from "../components/common/PlayButton";
import FavoriteButton from "../components/station/FavoriteButton";
import PageLoader from "../components/common/PageLoader";
import PlaylistItem from "../components/playlist/PlaylistItem";
import type { TVPage } from "../navigation";
import type { StationsResponse, StationPlaylistResponse } from "@/types";

interface StationPageProps {
  stationName: string;
  onNavigate: (page: TVPage, params?: Record<string, string>) => void;
  onBack: () => void;
}

// Child component — registers under StationPage's FocusContext
function BackButton({ onBack, label }: { onBack: () => void; label: string }) {
  const { ref, focused } = useFocusable({
    onEnterPress: onBack,
  });

  return (
    <div
      ref={ref}
      className={`mb-tv-3 flex w-fit items-center gap-3 rounded-tv-md px-tv-3 py-tv-1 text-tv-xs font-medium text-gray-400 tv-btn-focus cursor-pointer ${focused ? "focused" : ""}`}
    >
      <ArrowLeft className="h-6 w-6" />
      {label}
    </div>
  );
}

export default function StationPage({ stationName, onBack }: StationPageProps) {
  const { t } = useTranslation();

  const { ref: containerRef, focusKey, focusSelf } = useFocusable({
    isFocusBoundary: false,
  });

  // Focus this page when it mounts
  useEffect(() => {
    focusSelf();
  }, [focusSelf]);

  // Always show today's playlist (no day tabs on TV)
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const { data: stationData, loading: stationLoading } = useQuery<StationsResponse>(GET_STATIONS, {
    variables: { query: stationName, offset: 0, limit: 1 },
    skip: !stationName,
  });

  const station = useMemo(() => {
    return stationData?.getStations?.stations?.[0] ?? null;
  }, [stationData]);

  const { from, to } = useMemo(() => getPlaylistDateRange(today), [today]);

  const { data: playlistData, loading: playlistLoading } = useQuery<StationPlaylistResponse>(GET_STATION_PLAYLIST, {
    variables: { stationId: station?.id, from, to },
    skip: !station?.id || !station?.playlistAvailable,
    pollInterval: 60000,
  });

  const tracks = playlistData?.getStationPlaylist?.entries ?? [];

  useEffect(() => {
    if (station?.id) {
      tracker.trackEvent(AnalyticsEvents.STATION_DETAILS_VIEW, { stationId: station.id, stationName });
    }
  }, [station?.id, stationName]);

  if (stationLoading) {
    return <PageLoader />;
  }

  if (!station) {
    return (
      <FocusContext.Provider value={focusKey}>
        <div ref={containerRef} className="flex h-full flex-col items-center justify-center gap-tv-4">
          <p className="text-tv-base text-gray-500">{t("common.noResults")}</p>
          <BackButton onBack={onBack} label={t("station.backToStations")} />
        </div>
      </FocusContext.Provider>
    );
  }

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={containerRef} className="flex h-full flex-col p-tv-4">
        {/* Back button — child component, registers under this page */}
        <BackButton onBack={onBack} label={t("station.backToStations")} />

        {/* Station info + playlist in horizontal layout */}
        <div className="flex flex-1 gap-tv-5 overflow-hidden">
          {/* Left: station details */}
          <div className="w-[360px] shrink-0">
            <div className="rounded-tv-xl border border-gray-800 bg-gray-900 p-tv-4">
              <div className="flex flex-col items-center gap-tv-3 text-center">
                <StationImage imageUrl={station.imageUrl} name={station.name} size="xl" />

                <h1 className="text-tv-xl font-bold text-white">{station.name}</h1>

                {station.genres && station.genres.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2">
                    {station.genres.map((genre) => (
                      <span key={genre} className="inline-block rounded-full bg-gray-800 px-4 py-1.5 text-tv-xs font-medium text-gray-300">
                        {genre}
                      </span>
                    ))}
                  </div>
                )}

                {/* PlayButton & FavoriteButton are already child components ✓ */}
                <div className="flex items-center gap-tv-2 pt-tv-1">
                  <PlayButton stationId={station.id} streamUrl={station.stream?.sd} stationName={station.name} />
                  <FavoriteButton stationId={station.id} />
                </div>

                <SocialLinks station={station} />
              </div>
            </div>
          </div>

          {/* Right: playlist */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {station.playlistAvailable ? (
              <div className="flex flex-1 flex-col overflow-hidden rounded-tv-xl border border-gray-800 bg-gray-900">
                <div className="border-b border-gray-800 p-tv-3">
                  <div className="flex items-center gap-3">
                    <ListMusic className="h-7 w-7 text-gray-400" />
                    <h2 className="text-tv-lg font-semibold text-white">{t("station.todayPlaylist")}</h2>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {playlistLoading ? (
                    <PageLoader />
                  ) : tracks.length === 0 ? (
                    <div className="flex min-h-[200px] items-center justify-center">
                      <p className="text-tv-sm text-gray-500">{t("station.noPlaylistData")}</p>
                    </div>
                  ) : (
                    <div>
                      {tracks.map((track, index) => (
                        <PlaylistItem key={`${track.startedAt}-${index}`} track={track} isEven={index % 2 === 0} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-tv-xl border border-gray-800 bg-gray-900 p-tv-6">
                <p className="text-tv-sm text-gray-500">{t("station.playlistNotAvailable")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </FocusContext.Provider>
  );
}
