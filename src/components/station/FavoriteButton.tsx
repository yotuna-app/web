import { Heart } from "lucide-react";
import { useFavoritesStore, useConfigStore } from "@/stores";

interface FavoriteButtonProps {
  stationId: string;
  onLimitReached?: () => void;
}

export default function FavoriteButton({ stationId, onLimitReached }: FavoriteButtonProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const { appConfig } = useConfigStore();
  const favorite = isFavorite(stationId);

  function handleToggle(e: React.MouseEvent) {
    e.stopPropagation();

    if (favorite) {
      removeFavorite(stationId);
    } else {
      const result = addFavorite(stationId, appConfig.favoritesLimit);
      if (!result.success && result.error === "LIMIT_REACHED") {
        onLimitReached?.();
      }
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
      aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart className={`h-4 w-4 ${favorite ? "fill-red-500 text-red-500" : "text-gray-400 dark:text-gray-500"}`} />
    </button>
  );
}
