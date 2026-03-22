import { useNavigate } from "react-router-dom";
import PlayButton from "@/components/common/PlayButton";
import FavoriteButton from "./FavoriteButton";
import StationImage from "./StationImage";
import type { Station } from "@/types";

interface StationCardProps {
  station: Station;
}

export default function StationCard({ station }: StationCardProps) {
  const navigate = useNavigate();

  function handleClick() {
    navigate(`/station/${encodeURIComponent(station.name)}`);
  }

  return (
    <div
      onClick={handleClick}
      className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:shadow-lg dark:hover:shadow-black/20"
    >
      <StationImage imageUrl={station.imageUrl} name={station.name} size="md" />

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{station.name}</h3>

        {station.genres && station.genres.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {station.genres.slice(0, 3).map((genre) => (
              <span key={genre} className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                {genre}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <div onClick={(e) => e.stopPropagation()}>
          <PlayButton stationId={station.id} streamUrl={station.stream?.sd} stationName={station.name} size="sm" />
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <FavoriteButton stationId={station.id} />
        </div>
      </div>
    </div>
  );
}
