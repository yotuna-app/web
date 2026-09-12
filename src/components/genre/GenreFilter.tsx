import { useTranslation } from "react-i18next";
import { Tag, X } from "lucide-react";

interface GenreFilterProps {
  genres: string[];
  selectedGenres: string[];
  onToggleGenre: (genre: string) => void;
  onClearGenres: () => void;
}

export default function GenreFilter({
  genres,
  selectedGenres,
  onToggleGenre,
  onClearGenres,
}: GenreFilterProps) {
  const { t } = useTranslation();

  if (genres.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-xs dark:border-gray-800 dark:bg-gray-900/50">
      <div className="mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          <Tag className="h-3.5 w-3.5" />
          <span>{t("home.filterByGenre", "Filter by Genre")}</span>
          {selectedGenres.length > 0 && (
            <span className="rounded-full bg-primary-100 px-2 py-0.5 text-[11px] font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
              {selectedGenres.length}
            </span>
          )}
        </div>

        {selectedGenres.length > 0 && (
          <button
            onClick={onClearGenres}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            <X className="h-3 w-3" />
            <span>{t("home.clearFilters", "Clear all")}</span>
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {genres.map((genre) => {
          const isSelected = selectedGenres.includes(genre);
          return (
            <button
              key={genre}
              type="button"
              onClick={() => onToggleGenre(genre)}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                isSelected
                  ? "bg-primary-600 text-white shadow-xs dark:bg-primary-500"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              <span>{genre}</span>
              {isSelected && <X className="h-3 w-3 opacity-80" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
