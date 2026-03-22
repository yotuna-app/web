import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useConsentStore } from "@/stores";
import { tracker, AnalyticsEvents } from "@/analytics";

export default function GDPRModal() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { hasGivenConsent, setHasGivenConsent } = useConsentStore();

  if (hasGivenConsent !== null || pathname === "/privacy") return null;

  function handleAccept() {
    setHasGivenConsent(true);
    tracker.trackEvent(AnalyticsEvents.GDPR_CONSENT_GIVEN);
  }

  function handleDecline() {
    setHasGivenConsent(false);
    tracker.trackEvent(AnalyticsEvents.GDPR_CONSENT_DECLINED);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t("gdpr.title")}</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{t("gdpr.message")}</p>
        <a href="/privacy" target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm font-medium text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300">
          {t("gdpr.privacyPolicyLink")}
        </a>
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={handleDecline} className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
            {t("gdpr.decline")}
          </button>
          <button type="button" onClick={handleAccept} className="flex-1 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-500">
            {t("gdpr.accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
