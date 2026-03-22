import { useMemo, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatDayLabel } from "@/utils/dates";

interface DayTabsProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  daysBack: number;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function DayTabs({ selectedDate, onDateChange, daysBack }: DayTabsProps) {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);

  const days = useMemo(() => {
    const result: Date[] = [];
    const today = new Date();
    for (let i = 0; i <= daysBack; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      d.setHours(0, 0, 0, 0);
      result.push(d);
    }
    return result;
  }, [daysBack]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const activeButton = container.querySelector("[data-active='true']") as HTMLElement | null;
    if (activeButton) {
      activeButton.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [selectedDate]);

  function getLabel(date: Date, index: number): string {
    if (index === 0) return t("station.today");
    if (index === 1) return t("station.yesterday");
    return formatDayLabel(date);
  }

  function scrollBy(direction: number) {
    scrollRef.current?.scrollBy({ left: direction * 200, behavior: "smooth" });
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => scrollBy(-1)}
        className="shrink-0 rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300"
        aria-label={t("common.previous")}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div ref={scrollRef} className="flex flex-1 gap-1 overflow-x-auto scrollbar-none">
        {days.map((date, index) => {
          const active = isSameDay(date, selectedDate);
          return (
            <button
              key={date.toISOString()}
              data-active={active}
              onClick={() => onDateChange(date)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
                active
                  ? "bg-primary-600 text-white dark:bg-primary-500"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
            >
              {getLabel(date, index)}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => scrollBy(1)}
        className="shrink-0 rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300"
        aria-label={t("common.next")}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
