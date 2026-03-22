import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { tracker, AnalyticsEvents } from "@/analytics";
import { useDeviceStore } from "@/stores";
import { appSettings } from "@/constants/app";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/common/Toast";
import {
  Radio,
  Headphones,
  Music,
  Link2,
  Star,
  Moon,
  Clock,
  Clipboard,
  Smartphone,
  ExternalLink,
} from "lucide-react";

const FEATURES = [
  { icon: Radio, key: "feature1" },
  { icon: Headphones, key: "feature2" },
  { icon: Music, key: "feature3" },
  { icon: Link2, key: "feature4" },
  { icon: Star, key: "feature5" },
  { icon: Moon, key: "feature6" },
  { icon: Clock, key: "feature7" },
  { icon: Clipboard, key: "feature8" },
  { icon: Smartphone, key: "feature9" },
];

const TECH_STACK = [
  { name: "React 19", description: "TypeScript 5.9" },
  { name: "Vite 7", description: "Build tool" },
  { name: "Tailwind CSS v4", description: "Styling" },
  { name: "Zustand 5", description: "State management" },
  { name: "Apollo Client", description: "GraphQL" },
  { name: "react-i18next", description: "9 languages" },
];

export default function AboutPage() {
  const { t } = useTranslation();
  const { deviceId } = useDeviceStore();
  const { toast, showToast } = useToast();

  useEffect(() => {
    tracker.trackPageView("about");
  }, []);

  async function handleCopyDeviceId() {
    if (!deviceId) return;
    try {
      await navigator.clipboard.writeText(deviceId);
      tracker.trackEvent(AnalyticsEvents.DEVICE_ID_COPIED);
      showToast(t("common.copiedToClipboard"));
    } catch {
      // Clipboard API not available
    }
  }

  function handleDiscordClick() {
    tracker.trackEvent(AnalyticsEvents.DISCORD_LINK_CLICKED);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-900/30">
          <Radio className="h-8 w-8 text-primary-600 dark:text-primary-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t("about.title")}</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{t("about.description")}</p>
        <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
          {t("about.version")} {appSettings.appVersion}
        </p>
      </div>

      {/* Features */}
      <section>
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{t("about.features")}</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {FEATURES.map(({ icon: Icon, key }) => (
            <div key={key} className="flex items-start gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-800">
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">{t(`about.${key}`)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Technology */}
      <section>
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{t("about.technology")}</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {TECH_STACK.map((tech) => (
            <div key={tech.name} className="rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-800">
              <span className="text-sm font-medium text-gray-900 dark:text-white">{tech.name}</span>
              <p className="text-xs text-gray-500 dark:text-gray-400">{tech.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Community */}
      <section>
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{t("about.community")}</h3>
        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
          <h4 className="font-medium text-gray-900 dark:text-white">{t("about.discordTitle")}</h4>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{t("about.discordDescription")}</p>
          <a
            href={appSettings.discord.inviteUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleDiscordClick}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#5865F2] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4752C4]"
          >
            {t("about.joinDiscord")}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </section>

      {/* Mobile Apps */}
      <section>
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{t("about.mobileApps")}</h3>
        <div className="flex flex-wrap gap-3">
          <a
            href={`https://apps.apple.com/app/id${appSettings.store.appleId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
          >
            {t("about.appStore")}
            <ExternalLink className="h-3.5 w-3.5 opacity-70" />
          </a>
          <a
            href={`https://play.google.com/store/apps/details?id=${appSettings.store.androidPackage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
          >
            {t("about.playStore")}
            <ExternalLink className="h-3.5 w-3.5 opacity-70" />
          </a>
        </div>
      </section>

      {/* Website */}
      <section>
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{t("about.website")}</h3>
        <a
          href={appSettings.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary-500 transition-colors hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
        >
          {appSettings.websiteUrl}
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </section>

      {/* Device Info */}
      <section>
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{t("about.deviceInfo")}</h3>
        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t("about.deviceId")}</p>
          <button
            onClick={handleCopyDeviceId}
            className="mt-1 font-mono text-sm text-gray-900 transition-colors hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400"
          >
            {deviceId ?? "..."}
          </button>
        </div>
      </section>

      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}
