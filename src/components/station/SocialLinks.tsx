import { Globe } from "lucide-react";
import { tracker, AnalyticsEvents } from "@/analytics";
import type { Station } from "@/types";

interface SocialLinksProps {
  station: Station;
}

const socialPlatforms = [
  { key: "facebook" as const, label: "Facebook" },
  { key: "twitter" as const, label: "X" },
  { key: "instagram" as const, label: "Instagram" },
];

export default function SocialLinks({ station }: SocialLinksProps) {
  const { websiteUrl, social } = station;
  const hasAnySocial = websiteUrl || social?.facebook || social?.twitter || social?.instagram;

  if (!hasAnySocial) return null;

  function handleWebsiteClick() {
    tracker.trackEvent(AnalyticsEvents.WEBSITE_CLICKED, { stationId: station.id, url: websiteUrl });
  }

  function handleSocialClick(platform: string, url: string) {
    tracker.trackEvent(AnalyticsEvents.SOCIAL_LINK_CLICKED, { stationId: station.id, platform, url });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {websiteUrl && (
        <a
          href={websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWebsiteClick}
          className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          <Globe className="h-3 w-3" />
          Website
        </a>
      )}

      {socialPlatforms.map(({ key, label }) => {
        const url = social?.[key];
        if (!url) return null;

        return (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleSocialClick(key, url)}
            className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            {label}
          </a>
        );
      })}
    </div>
  );
}
