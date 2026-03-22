import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useConsentStore } from "@/stores";
import { LanguageSwitcher, ThemeSwitcher } from "@/components/layout";
import { tracker, AnalyticsEvents } from "@/analytics";

export default function SettingsPage() {
  const { t } = useTranslation();
  const { hasGivenConsent, setHasGivenConsent } = useConsentStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    tracker.trackPageView("settings");
  }, []);

  function handleResetGdpr() {
    setHasGivenConsent(null);
    setShowResetConfirm(false);
    tracker.trackEvent(AnalyticsEvents.GDPR_CONSENT_CHANGE, { action: "reset" });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t("settings.title")}</h2>

      {/* Appearance */}
      <section className="space-y-4 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
        <h3 className="font-semibold text-gray-900 dark:text-white">{t("settings.appearance")}</h3>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">{t("settings.light")} / {t("settings.dark")} / {t("settings.system")}</p>
            <ThemeSwitcher />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">{t("settings.language")}</p>
            <LanguageSwitcher />
          </div>
        </div>
      </section>

      {/* Privacy consent */}
      <section className="space-y-4 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
        <h3 className="font-semibold text-gray-900 dark:text-white">{t("settings.gdprConsent")}</h3>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {hasGivenConsent === null
              ? t("gdpr.prompt")
              : hasGivenConsent
                ? t("gdpr.accept")
                : t("gdpr.decline")}
          </p>

          {showResetConfirm ? (
            <div className="flex gap-2">
              <button
                onClick={handleResetGdpr}
                className="rounded-lg bg-red-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-600"
              >
                {t("settings.resetGdpr")}
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {t("station.backToStations")}
              </button>
            </div>
          ) : (
            hasGivenConsent !== null && (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {t("settings.resetGdpr")}
              </button>
            )
          )}
        </div>
      </section>
    </div>
  );
}
