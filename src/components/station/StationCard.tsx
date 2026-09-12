import { useNavigate, useSearchParams } from "react-router-dom";
import PlayButton from "@/components/common/PlayButton";
import FavoriteButton from "./FavoriteButton";
import StationImage from "./StationImage";
import type { Station } from "@/types";

interface StationCardProps {
  station: Station;
  from?: "all" | "favorites" | "genres";
}

export default function StationCard({ station, from }: StationCardProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  function handleClick() {
    navigate(`/station/${encodeURIComponent(station.id)}`, {
      state: { from, search: searchParams.toString() },
    });
  }

  function handleGenreClick(e: React.MouseEvent, genre: string) {
    e.stopPropagation();
    const raw = searchParams.get("genres");
    const current = raw
      ? raw
          .split(",")
          .map((g) => g.trim())
          .filter((g) => g.length > 0)
      : [];

    if (current.includes(genre)) {
      navigate(`/genres?genres=${encodeURIComponent(current.join(","))}`);
      return;
    }

    const next = [...current, genre];
    navigate(`/genres?genres=${encodeURIComponent(next.join(","))}`);
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
              <button
                key={genre}
                type="button"
                onClick={(e) => handleGenreClick(e, genre)}
                className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500 transition-colors hover:bg-primary-50 hover:text-primary-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-primary-900/30 dark:hover:text-primary-300"
              >
                {genre}
              </button>
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
