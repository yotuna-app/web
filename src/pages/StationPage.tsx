import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@apollo/client";
import { ArrowLeft, ListMusic } from "lucide-react";
import { GET_STATIONS, GET_STATION_PLAYLIST } from "@/graphql/queries";
import { useConfigStore, useAudioStore } from "@/stores";
import { tracker, AnalyticsEvents } from "@/analytics";
import { getPlaylistDateRange } from "@/utils/dates";
import StationImage from "@/components/station/StationImage";
import SocialLinks from "@/components/station/SocialLinks";
import PlayButton from "@/components/common/PlayButton";
import FavoriteButton from "@/components/station/FavoriteButton";
import AudioPlayerBar from "@/components/common/AudioPlayerBar";
import PageLoader from "@/components/common/PageLoader";
import DayTabs from "@/components/playlist/DayTabs";
import PlaylistItem from "@/components/playlist/PlaylistItem";
import type { StationsResponse, StationPlaylistResponse } from "@/types";

export default function StationPage() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { appConfig } = useConfigStore();
  const { currentStationId } = useAudioStore();

  const decodedName = name ? decodeURIComponent(name) : "";

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  // Fetch station details by name
  const { data: stationData, loading: stationLoading } = useQuery<StationsResponse>(GET_STATIONS, {
    variables: { query: decodedName, offset: 0, limit: 1 },
    skip: !decodedName,
  });

  const station = useMemo(() => {
    return stationData?.getStations?.stations?.[0] ?? null;
  }, [stationData]);

  // Fetch playlist using station id
  const { from, to } = useMemo(() => getPlaylistDateRange(selectedDate), [selectedDate]);

  const { data: playlistData, loading: playlistLoading } = useQuery<StationPlaylistResponse>(GET_STATION_PLAYLIST, {
    variables: { stationId: station?.id, from, to },
    skip: !station?.id || !station?.playlistAvailable,
  });

  const tracks = playlistData?.getStationPlaylist?.entries ?? [];

  useEffect(() => {
    if (station?.id) {
      tracker.trackEvent(AnalyticsEvents.STATION_DETAILS_VIEW, { stationId: station.id, stationName: decodedName });
    }
  }, [station?.id, decodedName]);

  if (stationLoading) {
    return <PageLoader />;
  }

  if (!station) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
        <p className="text-gray-500 dark:text-gray-400">{t("common.noResults")}</p>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-primary-600 transition-colors hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/20"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("station.backToStations")}
        </button>
      </div>
    );
  }

  return (
    <div className={`${currentStationId ? "pb-20" : ""}`}>
      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("station.backToStations")}
      </button>

      {/* Main content - two-column on lg+ */}
      <div className="mt-6 space-y-6 lg:grid lg:grid-cols-[280px_1fr] lg:gap-8 lg:space-y-0">
        {/* Station info panel */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start lg:flex-col lg:items-center">
              <StationImage imageUrl={station.imageUrl} name={station.name} size="xl" />

              <div className="flex-1 space-y-3 lg:w-full lg:text-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{station.name}</h1>

                {station.genres && station.genres.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 lg:justify-center">
                    {station.genres.map((genre) => (
                      <span key={genre} className="inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                        {genre}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1 lg:justify-center">
                  <PlayButton stationId={station.id} streamUrl={station.stream?.sd} stationName={station.name} size="md" />
                  <FavoriteButton stationId={station.id} />
                </div>

                <div className="lg:flex lg:justify-center">
                  <SocialLinks station={station} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Playlist section */}
        {station.playlistAvailable ? (
          <section>
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <div className="border-b border-gray-100 p-4 dark:border-gray-800">
                <div className="mb-3 flex items-center gap-2">
                  <ListMusic className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t("station.playlist")}</h2>
                </div>

                <DayTabs selectedDate={selectedDate} onDateChange={setSelectedDate} daysBack={appConfig.playlistDaysBack} />
              </div>

              {playlistLoading ? (
                <PageLoader />
              ) : tracks.length === 0 ? (
                <div className="flex min-h-[10vh] items-center justify-center p-6">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t("station.noPlaylistData")}</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {tracks.map((track, index) => (
                    <PlaylistItem key={`${track.startedAt}-${index}`} track={track} isEven={index % 2 === 0} />
                  ))}
                </div>
              )}
            </div>
          </section>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t("station.playlistNotAvailable")}</p>
          </div>
        )}
      </div>

      <AudioPlayerBar />
    </div>
  );
}
