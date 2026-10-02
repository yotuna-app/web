import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useFocusable, FocusContext } from "@noriginmedia/norigin-spatial-navigation";
import { ArrowLeft } from "lucide-react";
import { tracker } from "@/analytics";

interface SettingsPageProps {
  onBack: () => void;
}

// Child component — registers under SettingsPage's FocusContext
function BackButton({ onBack, label }: { onBack: () => void; label: string }) {
  const { ref, focused } = useFocusable({
    onEnterPress: onBack,
  });

  return (
    <div
      ref={ref}
      onClick={onBack}
      className={`mb-tv-4 flex w-fit items-center gap-3 rounded-tv-md px-tv-3 py-tv-1 text-tv-xs font-medium text-gray-400 tv-btn-focus cursor-pointer ${focused ? "focused" : ""}`}
    >
      <ArrowLeft className="h-6 w-6" />
      {label}
    </div>
  );
}

// Child component for language selector
function LanguageSelector({ currentLang, onChangeLang, hint }: {
  currentLang: string;
  onChangeLang: () => void;
  hint: string;
}) {
  const { ref, focused } = useFocusable({
    onEnterPress: onChangeLang,
  });

  return (
    <div
      ref={ref}
      onClick={onChangeLang}
      className={`inline-flex rounded-tv-md bg-gray-800 px-tv-4 py-tv-2 tv-btn-focus cursor-pointer ${focused ? "focused" : ""}`}
    >
      <span className="text-tv-sm font-medium text-gray-300">{currentLang.toUpperCase()}</span>
      <span className="ml-3 text-tv-xs text-gray-500">{hint}</span>
    </div>
  );
}

export default function SettingsPage({ onBack }: SettingsPageProps) {
  const { t, i18n } = useTranslation();

  const { ref: containerRef, focusKey, focusSelf } = useFocusable({
    isFocusBoundary: false,
  });

  // Focus this page when it mounts
  useEffect(() => {
    focusSelf();
  }, [focusSelf]);

  useEffect(() => {
    tracker.trackPageView("tv_settings");
  }, []);

  const languages = ["en", "pl", "de", "fr", "es", "ar", "zh", "hi", "ja", "ru"];
  const currentLangIndex = languages.indexOf(i18n.language);

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={containerRef} className="flex h-full flex-col p-tv-4">
        {/* Back — child component */}
        <BackButton onBack={onBack} label={t("station.backToStations")} />

        <h2 className="mb-tv-4 text-tv-2xl font-bold text-white">{t("settings.title")}</h2>

        <div className="space-y-tv-4">
          {/* Language */}
          <section className="rounded-tv-lg border border-gray-800 bg-gray-900 p-tv-4">
            <h3 className="mb-tv-3 text-tv-lg font-semibold text-white">{t("settings.language")}</h3>
            <LanguageSelector
              currentLang={i18n.language}
              hint={t("settings.pressToChange", "Press to change")}
              onChangeLang={() => {
                const nextIndex = (currentLangIndex + 1) % languages.length;
                i18n.changeLanguage(languages[nextIndex]);
              }}
            />
          </section>
        </div>
      </div>
    </FocusContext.Provider>
  );
}
