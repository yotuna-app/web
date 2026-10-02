import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@apollo/client";
import { useFocusable, FocusContext } from "@noriginmedia/norigin-spatial-navigation";
import { Search } from "lucide-react";
import { GET_STATIONS } from "@/graphql";
import { tracker } from "@/analytics";
import StationList from "../components/station/StationList";
import type { TVPage } from "../navigation";
import type { Station, StationsResponse } from "@/types";

interface SearchPageProps {
  onNavigate: (page: TVPage, params?: Record<string, string>) => void;
}

/**
 * Focusable search input for TV.
 * Auto-focuses the HTML input on mount to bring up webOS virtual keyboard.
 * Press Enter/OK to re-open the keyboard after dismissing it.
 */
function TVSearchInput({ value, onChange, placeholder, autoFocus }: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoFocus?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { ref, focused } = useFocusable({
    onEnterPress: () => {
      inputRef.current?.focus();
    },
  });

  // Auto-focus the HTML input to trigger webOS virtual keyboard
  useEffect(() => {
    if (autoFocus) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [autoFocus]);

  return (
    <div
      ref={ref}
      onClick={() => inputRef.current?.focus()}
      className={`flex items-center gap-3 rounded-tv-lg border-2 bg-gray-900 px-tv-3 py-tv-2 tv-btn-focus cursor-pointer ${
        focused ? "focused border-primary-500" : "border-gray-700"
      }`}
    >
      <Search className="h-7 w-7 shrink-0 text-gray-400" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-tv-sm text-white placeholder-gray-500 outline-none"
      />
      {focused && !value && (
        <span className="text-tv-xs text-gray-500 whitespace-nowrap">OK</span>
      )}
    </div>
  );
}

export default function SearchPage({ onNavigate }: SearchPageProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");

  const { ref: containerRef, focusKey, focusSelf } = useFocusable({
    isFocusBoundary: false,
    focusable: true,
  });

  // Focus this page when it mounts
  useEffect(() => {
    focusSelf();
  }, [focusSelf]);

  useEffect(() => {
    tracker.trackPageView("tv_search");
  }, []);

  // Only query the API when there's actual search text
  const { data, loading } = useQuery<StationsResponse>(GET_STATIONS, {
    variables: { query: query.trim(), offset: 0, limit: 50 },
    skip: query.trim().length === 0,
  });

  const stations = data?.getStations?.stations ?? [];

  const handleSelectStation = useCallback(
    (station: Station) => {
      onNavigate("station", { name: station.name });
    },
    [onNavigate],
  );

  const hasQuery = query.trim().length > 0;

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={containerRef} className="flex h-full flex-col p-tv-4">
        {/* Search input */}
        <div className="mb-tv-4 max-w-[800px]">
          <TVSearchInput
            value={query}
            onChange={setQuery}
            placeholder={t("common.search")}
            autoFocus
          />
        </div>

        {/* Results or empty state */}
        <div className="flex-1 overflow-y-auto">
          {!hasQuery ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
              <Search className="h-16 w-16 text-gray-700" />
              <p className="text-tv-base text-gray-500">{t("common.search")}</p>
            </div>
          ) : (
            <StationList
              stations={stations}
              loading={loading}
              emptyMessage={t("common.noResults")}
              onSelectStation={handleSelectStation}
            />
          )}
        </div>
      </div>
    </FocusContext.Provider>
  );
}
