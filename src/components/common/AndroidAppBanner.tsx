import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { isAndroidDevice } from "@/utils/device";
import { getAndroidIntentUrl } from "@/utils/deepLink";
import { tracker, AnalyticsEvents } from "@/analytics";

export const ANDROID_BANNER_DISMISSED_KEY = "yotuna-android-banner-dismissed";

export default function AndroidAppBanner() {
  const { t } = useTranslation();
  const location = useLocation();

  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ANDROID_BANNER_DISMISSED_KEY) === "true";
    } catch {
      return false;
    }
  });

  const [isAndroid] = useState<boolean>(() => isAndroidDevice());

  const isVisible = isAndroid && !isDismissed;

  useEffect(() => {
    if (isVisible) {
      tracker.trackEvent(AnalyticsEvents.APP_BANNER_IMPRESSION);
    }
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  const intentUrl = getAndroidIntentUrl(location.pathname);

  function handleDismiss() {
    try {
      localStorage.setItem(ANDROID_BANNER_DISMISSED_KEY, "true");
    } catch {
      // Ignore localStorage errors
    }
    setIsDismissed(true);
    tracker.trackEvent(AnalyticsEvents.APP_BANNER_DISMISSED);
  }

  function handleActionClick() {
    tracker.trackEvent(AnalyticsEvents.APP_BANNER_CLICKED);
  }

  return (
    <aside
      aria-label={t("appBanner.title")}
      className="relative z-40 flex items-center justify-between gap-3 border-b border-gray-200 bg-white px-3 py-2 dark:border-gray-800 dark:bg-gray-950 sm:px-4"
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <button
          type="button"
          onClick={handleDismiss}
          aria-label={t("appBanner.dismiss")}
          className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-200"
        >
          <X className="h-4 w-4" />
        </button>

        <img
          src="/logo.png"
          alt="Yotuna"
          className="h-9 w-9 shrink-0 rounded-xl object-contain shadow-xs"
        />

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900 dark:text-white leading-tight">
            {t("appBanner.title")}
          </p>
          <p className="truncate text-xs text-gray-500 dark:text-gray-400">
            {t("appBanner.subtitle")}
          </p>
        </div>
      </div>

      <div className="shrink-0">
        <a
          href={intentUrl}
          onClick={handleActionClick}
          className="inline-flex items-center justify-center rounded-full bg-primary-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-primary-600 focus:outline-hidden focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
        >
          {t("appBanner.open")}
        </a>
      </div>
    </aside>
  );
}
