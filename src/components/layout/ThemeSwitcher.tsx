import { Sun, Moon, Monitor } from "lucide-react";
import { useSettingsStore, type Theme } from "@/stores";

const themes: { value: Theme; icon: typeof Sun }[] = [
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
  { value: "system", icon: Monitor },
];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useSettingsStore();

  return (
    <div className="flex items-center rounded-lg border border-gray-200 dark:border-gray-700">
      {themes.map(({ value, icon: Icon }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`rounded-md p-1.5 transition-colors ${
            theme === value
              ? "bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
          title={value}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}
