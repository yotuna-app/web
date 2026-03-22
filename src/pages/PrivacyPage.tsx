import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { tracker } from "@/analytics";

export default function PrivacyPage() {
  const { t } = useTranslation();

  useEffect(() => {
    tracker.trackPageView("privacy");
  }, []);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t("privacy.title")}</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{t("privacy.intro")}</p>
      </div>

      <section className="space-y-4 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
        <h3 className="font-semibold text-gray-900 dark:text-white">{t("privacy.localData")}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{t("privacy.localDataDescription")}</p>
      </section>

      <section className="space-y-4 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
        <h3 className="font-semibold text-gray-900 dark:text-white">{t("privacy.analytics")}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{t("privacy.analyticsDescription")}</p>
      </section>

      <section className="space-y-4 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
        <h3 className="font-semibold text-gray-900 dark:text-white">{t("privacy.cookies")}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{t("privacy.cookiesDescription")}</p>
      </section>

      <section className="space-y-4 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
        <h3 className="font-semibold text-gray-900 dark:text-white">{t("privacy.streaming")}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{t("privacy.streamingDescription")}</p>
      </section>

      <section className="space-y-4 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
        <h3 className="font-semibold text-gray-900 dark:text-white">{t("privacy.audioStreaming")}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{t("privacy.audioStreamingDescription")}</p>
      </section>

      <section className="space-y-4 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
        <h3 className="font-semibold text-gray-900 dark:text-white">{t("privacy.contact")}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{t("privacy.contactDescription")}</p>
      </section>
    </div>
  );
}
