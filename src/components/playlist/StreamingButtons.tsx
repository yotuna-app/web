import { useTranslation } from "react-i18next";
import { tracker, AnalyticsEvents } from "@/analytics";
import type { PlaylistTrack } from "@/types";

interface StreamingButtonsProps {
  track: PlaylistTrack;
}

interface StreamingService {
  key: string;
  label: string;
  trackId: string | undefined;
  url: (id: string) => string;
  color: string;
}

export default function StreamingButtons({ track }: StreamingButtonsProps) {
  const { t } = useTranslation();

  const services: StreamingService[] = [
    { key: "deezer", label: t("station.openInDeezer"), trackId: track.deezerTrackId, url: id => `https://www.deezer.com/track/${id}`, color: "#EF5466" },
    { key: "tidal", label: t("station.openInTidal"), trackId: track.tidalTrackId, url: id => `https://tidal.com/browse/track/${id}`, color: "#000000" },
    { key: "spotify", label: t("station.openInSpotify"), trackId: track.spotifyTrackId, url: id => `https://open.spotify.com/track/${id}`, color: "#1DB954" },
    { key: "apple", label: t("station.openInAppleMusic"), trackId: track.appleTrackId, url: id => `https://music.apple.com/song/${id}`, color: "#FA243C" },
  ];

  const available = services.filter(s => s.trackId);

  if (available.length === 0) {
    return null;
  }

  function handleClick(service: StreamingService) {
    tracker.trackEvent(AnalyticsEvents.STREAMING_LINK_CLICKED, { service: service.key, trackId: service.trackId });
    window.open(service.url(service.trackId!), "_blank", "noopener,noreferrer");
  }

  return (
    <div className="flex flex-wrap gap-1">
      {available.map(service => (
        <button
          key={service.key}
          onClick={() => handleClick(service)}
          style={{ backgroundColor: service.color }}
          className="rounded-full px-2 py-0.5 text-[11px] font-medium text-white transition-opacity hover:opacity-80 sm:px-2.5 sm:text-xs"
        >
          {service.label}
        </button>
      ))}
    </div>
  );
}
