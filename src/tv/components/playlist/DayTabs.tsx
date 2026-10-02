import { useMemo, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useFocusable, FocusContext } from "@noriginmedia/norigin-spatial-navigation";
import { formatDayLabel } from "@/utils/dates";

interface DayTabsProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  daysBack: number;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

interface DayButtonProps {
  date: Date;
  label: string;
  isActive: boolean;
  onSelect: (date: Date) => void;
}

function DayButton({ date, label, isActive, onSelect }: DayButtonProps) {
  const { ref, focused } = useFocusable({
    onEnterPress: () => onSelect(date),
  });

  return (
    <div
      ref={ref}
      data-active={isActive}
      className={`shrink-0 rounded-tv-md px-tv-3 py-tv-2 tv-btn-focus cursor-pointer ${
        isActive
          ? "bg-primary-600 text-white"
          : "text-gray-400"
      } ${focused ? "focused" : ""}`}
    >
      <span className="text-tv-xs font-medium whitespace-nowrap">{label}</span>
    </div>
  );
}

export default function DayTabs({ selectedDate, onDateChange, daysBack }: DayTabsProps) {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { ref, focusKey } = useFocusable();

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

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="flex items-center gap-2">
        <div ref={scrollRef} className="flex flex-1 gap-2 overflow-x-auto">
          {days.map((date, index) => (
            <DayButton
              key={date.toISOString()}
              date={date}
              label={getLabel(date, index)}
              isActive={isSameDay(date, selectedDate)}
              onSelect={onDateChange}
            />
          ))}
        </div>
      </div>
    </FocusContext.Provider>
  );
}
