import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { Play, Pause, Loader2, Heart } from "lucide-react";
import { useAudioStore, useFavoritesStore } from "@/stores";
import StationImage from "./StationImage";
import type { Station } from "@/types";

interface StationCardProps {
  station: Station;
  onSelect: (station: Station) => void;
}

export default function StationCard({ station, onSelect }: StationCardProps) {
  const { currentStationId, isPlaying, isBuffering } = useAudioStore();
  const { isFavorite } = useFavoritesStore();

  const isCurrentStation = currentStationId === station.id;
  const isActive = isCurrentStation && isPlaying;
  const favorite = isFavorite(station.id);

  const { ref, focused } = useFocusable({
    onEnterPress: () => onSelect(station),
    onFocus: ({ node }) => {
      node?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    },
  });

  return (
    <div
      ref={ref}
      onClick={() => onSelect(station)}
      className={`flex items-center gap-tv-3 rounded-tv-lg border border-gray-800 bg-gray-900 p-tv-3 tv-card-focus cursor-pointer ${focused ? "focused" : ""}`}
    >
      <StationImage imageUrl={station.imageUrl} name={station.name} size="md" />

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-tv-sm font-semibold text-white">{station.name}</h3>

        {station.genres && station.genres.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {station.genres.slice(0, 3).map((genre) => (
              <span key={genre} className="inline-block rounded-full bg-gray-800 px-3 py-1 text-tv-xs font-medium text-gray-400">
                {genre}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Status indicators (non-focusable) */}
      <div className="flex shrink-0 items-center gap-3">
        {isCurrentStation && (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600">
            {isBuffering ? (
              <Loader2 className="h-5 w-5 text-white animate-spin" />
            ) : isActive ? (
              <Pause className="h-5 w-5 text-white" />
            ) : (
              <Play className="h-5 w-5 text-white" />
            )}
          </div>
        )}
        {favorite && (
          <Heart className="h-5 w-5 fill-red-500 text-red-500" />
        )}
      </div>
    </div>
  );
}
