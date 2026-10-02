import { Globe } from "lucide-react";
import { useFocusable, FocusContext } from "@noriginmedia/norigin-spatial-navigation";
import { tracker, AnalyticsEvents } from "@/analytics";
import type { Station } from "@/types";

interface SocialLinksProps {
  station: Station;
}

interface LinkButtonProps {
  label: string;
  url: string;
  icon?: React.ReactNode;
  onPress: () => void;
}

function LinkButton({ label, icon, onPress }: LinkButtonProps) {
  const { ref, focused } = useFocusable({
    onEnterPress: onPress,
  });

  return (
    <div
      ref={ref}
      onClick={onPress}
      className={`inline-flex items-center gap-2 rounded-tv-md bg-gray-800 px-tv-3 py-tv-1 tv-btn-focus cursor-pointer ${focused ? "focused" : ""}`}
    >
      {icon}
      <span className="text-tv-xs font-medium text-gray-300">{label}</span>
    </div>
  );
}

const socialPlatforms = [
  { key: "facebook" as const, label: "Facebook" },
  { key: "twitter" as const, label: "X" },
  { key: "instagram" as const, label: "Instagram" },
];

export default function SocialLinks({ station }: SocialLinksProps) {
  const { websiteUrl, social } = station;
  const hasAnySocial = websiteUrl || social?.facebook || social?.twitter || social?.instagram;
  const { ref, focusKey } = useFocusable();

  if (!hasAnySocial) return null;

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="flex flex-wrap items-center gap-3">
        {websiteUrl && (
          <LinkButton
            label="Website"
            url={websiteUrl}
            icon={<Globe className="h-5 w-5" />}
            onPress={() => {
              tracker.trackEvent(AnalyticsEvents.WEBSITE_CLICKED, { stationId: station.id, url: websiteUrl });
              window.open(websiteUrl, "_blank");
            }}
          />
        )}

        {socialPlatforms.map(({ key, label }) => {
          const url = social?.[key];
          if (!url) return null;

          return (
            <LinkButton
              key={key}
              label={label}
              url={url}
              onPress={() => {
                tracker.trackEvent(AnalyticsEvents.SOCIAL_LINK_CLICKED, { stationId: station.id, platform: key, url });
                window.open(url, "_blank");
              }}
            />
          );
        })}
      </div>
    </FocusContext.Provider>
  );
}
