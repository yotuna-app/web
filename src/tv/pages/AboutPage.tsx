import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useFocusable, FocusContext } from "@noriginmedia/norigin-spatial-navigation";
import { ArrowLeft, Radio, Headphones, Music, Star, Globe, Clock } from "lucide-react";
import { tracker } from "@/analytics";
import { useDeviceStore } from "@/stores";
import { appSettings } from "@/constants";

interface AboutPageProps {
  onBack: () => void;
}

const FEATURES = [
  { icon: Radio, key: "feature1" },
  { icon: Headphones, key: "feature2" },
  { icon: Music, key: "feature3" },
  { icon: Star, key: "feature5" },
  { icon: Globe, key: "feature6" },
  { icon: Clock, key: "feature7" },
];

// Child component — registers under AboutPage's FocusContext
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

export default function AboutPage({ onBack }: AboutPageProps) {
  const { t } = useTranslation();
  const { deviceId } = useDeviceStore();

  const { ref: containerRef, focusKey, focusSelf } = useFocusable({
    isFocusBoundary: false,
  });

  // Focus this page when it mounts
  useEffect(() => {
    focusSelf();
  }, [focusSelf]);

  useEffect(() => {
    tracker.trackPageView("tv_about");
  }, []);

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={containerRef} className="flex h-full flex-col p-tv-4 overflow-y-auto">
        {/* Back — child component */}
        <BackButton onBack={onBack} label={t("station.backToStations")} />

        {/* Title */}
        <div className="mb-tv-6 text-center">
          <h2 className="text-tv-3xl font-bold text-white">{t("about.title")}</h2>
          <p className="mt-tv-2 text-tv-sm text-gray-400">{t("about.description")}</p>
          <p className="mt-tv-1 text-tv-xs text-gray-600">
            {t("about.version")} {appSettings.appVersion}
          </p>
        </div>

        {/* Features grid */}
        <section className="mb-tv-6">
          <h3 className="mb-tv-3 text-tv-lg font-semibold text-white">{t("about.features")}</h3>
          <div className="grid grid-cols-3 gap-tv-3">
            {FEATURES.map(({ icon: Icon, key }) => (
              <div key={key} className="flex items-start gap-3 rounded-tv-lg border border-gray-800 bg-gray-900 p-tv-3">
                <Icon className="mt-1 h-7 w-7 shrink-0 text-primary-500" />
                <span className="text-tv-xs text-gray-300">{t(`about.${key}`)}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Device ID */}
        <section>
          <h3 className="mb-tv-3 text-tv-lg font-semibold text-white">{t("about.deviceInfo")}</h3>
          <div className="rounded-tv-lg border border-gray-800 bg-gray-900 p-tv-4">
            <p className="text-tv-xs text-gray-500">{t("about.deviceId")}</p>
            <p className="mt-tv-1 font-mono text-tv-xs text-gray-300">{deviceId ?? "..."}</p>
          </div>
        </section>
      </div>
    </FocusContext.Provider>
  );
}
