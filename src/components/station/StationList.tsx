import { useTranslation } from "react-i18next";
import PageLoader from "@/components/common/PageLoader";
import StationCard from "./StationCard";
import type { Station } from "@/types";

interface StationListProps {
  stations: Station[];
  loading?: boolean;
  emptyMessage?: string;
}

export default function StationList({ stations, loading, emptyMessage }: StationListProps) {
  const { t } = useTranslation();

  if (loading) {
    return <PageLoader />;
  }

  if (stations.length === 0) {
    return (
      <div className="flex min-h-[20vh] items-center justify-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">{emptyMessage ?? t("stations.empty", "No stations found")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {stations.map((station) => (
        <StationCard key={station.id} station={station} />
      ))}
    </div>
  );
}
