import { useTranslation } from "react-i18next";
import { useFocusable, FocusContext } from "@noriginmedia/norigin-spatial-navigation";
import PageLoader from "../common/PageLoader";
import StationCard from "./StationCard";
import type { Station } from "@/types";

interface StationListProps {
  stations: Station[];
  loading?: boolean;
  emptyMessage?: string;
  onSelectStation: (station: Station) => void;
}

export default function StationList({ stations, loading, emptyMessage, onSelectStation }: StationListProps) {
  const { t } = useTranslation();
  const { ref, focusKey } = useFocusable();

  if (loading) {
    return <PageLoader />;
  }

  if (stations.length === 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-tv-base text-gray-500">{emptyMessage ?? t("stations.empty", "No stations found")}</p>
      </div>
    );
  }

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="grid grid-cols-2 gap-tv-3">
        {stations.map((station) => (
          <StationCard key={station.id} station={station} onSelect={onSelectStation} />
        ))}
      </div>
    </FocusContext.Provider>
  );
}
