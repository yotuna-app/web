import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { Heart } from "lucide-react";
import { useFavoritesStore, useConfigStore } from "@/stores";

interface FavoriteButtonProps {
  stationId: string;
}

export default function FavoriteButton({ stationId }: FavoriteButtonProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const { appConfig } = useConfigStore();
  const favorite = isFavorite(stationId);

  const { ref, focused } = useFocusable({
    onEnterPress: () => {
      if (favorite) {
        removeFavorite(stationId);
      } else {
        addFavorite(stationId, appConfig.favoritesLimit);
      }
    },
  });

  return (
    <div
      ref={ref}
      className={`flex h-14 w-14 items-center justify-center rounded-full tv-btn-focus cursor-pointer ${focused ? "focused" : ""}`}
    >
      <Heart className={`h-7 w-7 ${favorite ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
    </div>
  );
}
