import { useTranslation } from "react-i18next";
import { tracker, AnalyticsEvents } from "@/analytics";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/common/Toast";
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
  const { toast, showToast } = useToast();

  const services: StreamingService[] = [
    { key: "deezer", label: t("station.openInDeezer"), trackId: track.deezerTrackId, url: id => `https://www.deezer.com/track/${id}`, color: "#EF5466" },
    { key: "tidal", label: t("station.openInTidal"), trackId: track.tidalTrackId, url: id => `https://tidal.com/browse/track/${id}`, color: "#000000" },
    { key: "spotify", label: t("station.openInSpotify"), trackId: track.spotifyTrackId, url: id => `https://open.spotify.com/track/${id}`, color: "#1DB954" },
    { key: "apple", label: t("station.openInAppleMusic"), trackId: track.appleTrackId, url: id => `https://music.apple.com/song/${id}`, color: "#FA243C" },
  ];

  function handleClick(e: React.MouseEvent, service: StreamingService) {
    e.stopPropagation();
    if (!service.trackId) {
      showToast(t("station.trackNotFound"));
      return;
    }
    tracker.trackEvent(AnalyticsEvents.STREAMING_LINK_CLICKED, { service: service.key, trackId: service.trackId });
    window.open(service.url(service.trackId), "_blank", "noopener,noreferrer");
  }

  return (
    <>
      <div className="flex flex-wrap gap-1">
        {services.map(service => {
          const disabled = !service.trackId;
          return (
            <button
              key={service.key}
              onClick={e => handleClick(e, service)}
              style={{ backgroundColor: service.color }}
              className={`rounded-full px-2 py-0.5 text-[11px] font-medium text-white transition-opacity sm:px-2.5 sm:text-xs ${disabled ? "opacity-30 hover:opacity-40" : "hover:opacity-80"}`}
            >
              {service.label}
            </button>
          );
        })}
      </div>

      <Toast message={toast.message} visible={toast.visible} />
    </>
  );
}
