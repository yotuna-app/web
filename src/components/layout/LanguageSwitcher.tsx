import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/i18n";
import { useSettingsStore } from "@/stores";

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const { setLanguage } = useSettingsStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg border border-gray-200 p-1.5 text-gray-500 transition-colors hover:text-gray-700 dark:border-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        title={t("settings.selectLanguage")}
      >
        <Languages className="h-4 w-4" />
        <span className="text-xs font-medium uppercase">{i18n.language.slice(0, 2)}</span>
      </button>

      {open && (
        <div className="absolute end-0 top-full z-50 mt-1 min-w-[140px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => {
                setLanguage(lang as SupportedLanguage);
                setOpen(false);
              }}
              className={`w-full px-3 py-1.5 text-start text-sm transition-colors ${
                i18n.language === lang
                  ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              {t(`language.${lang}`)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
