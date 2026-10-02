import { useFocusable, FocusContext } from "@noriginmedia/norigin-spatial-navigation";
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

function ServiceButton({ service }: { service: StreamingService }) {
  const handleClick = () => {
    tracker.trackEvent(AnalyticsEvents.STREAMING_LINK_CLICKED, { service: service.key, trackId: service.trackId });
    window.open(service.url(service.trackId!), "_blank");
  };

  const { ref, focused } = useFocusable({
    onEnterPress: handleClick,
  });

  return (
    <div
      ref={ref}
      onClick={handleClick}
      style={{ backgroundColor: service.color }}
      className={`rounded-full px-4 py-2 tv-btn-focus cursor-pointer ${focused ? "focused" : ""}`}
    >
      <span className="text-tv-xs font-medium text-white">{service.label}</span>
    </div>
  );
}

export default function StreamingButtons({ track }: StreamingButtonsProps) {
  const { t } = useTranslation();
  const { ref, focusKey } = useFocusable();

  const services: StreamingService[] = [
    { key: "deezer", label: t("station.openInDeezer"), trackId: track.deezerTrackId, url: id => `https://www.deezer.com/track/${id}`, color: "#EF5466" },
    { key: "tidal", label: t("station.openInTidal"), trackId: track.tidalTrackId, url: id => `https://tidal.com/browse/track/${id}`, color: "#000000" },
    { key: "spotify", label: t("station.openInSpotify"), trackId: track.spotifyTrackId, url: id => `https://open.spotify.com/track/${id}`, color: "#1DB954" },
    { key: "apple", label: t("station.openInAppleMusic"), trackId: track.appleTrackId, url: id => `https://music.apple.com/song/${id}`, color: "#FA243C" },
  ];

  const available = services.filter(s => s.trackId);
  if (available.length === 0) return null;

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="flex flex-wrap gap-2">
        {available.map(service => (
          <ServiceButton key={service.key} service={service} />
        ))}
      </div>
    </FocusContext.Provider>
  );
}
