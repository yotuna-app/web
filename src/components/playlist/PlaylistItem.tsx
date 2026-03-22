import { useTranslation } from "react-i18next";
import { tracker, AnalyticsEvents } from "@/analytics";
import { useToast } from "@/hooks/useToast";
import { formatPlaylistTime } from "@/utils/dates";
import Toast from "@/components/common/Toast";
import PlaylistImage from "./PlaylistImage";
import StreamingButtons from "./StreamingButtons";
import type { PlaylistTrack } from "@/types";

interface PlaylistItemProps {
  track: PlaylistTrack;
  isEven?: boolean;
}

export default function PlaylistItem({ track, isEven }: PlaylistItemProps) {
  const { t } = useTranslation();
  const { toast, showToast } = useToast();
  const time = formatPlaylistTime(track.startedAt);

  async function handleCopy() {
    const text = `${track.artists} - ${track.title}`;
    try {
      await navigator.clipboard.writeText(text);
      tracker.trackEvent(AnalyticsEvents.PLAYLIST_TRACK_COPIED, { title: track.title, artists: track.artists });
      showToast(t("station.copiedToClipboard"));
    } catch {
      // Clipboard API not available or denied
    }
  }

  return (
    <>
      <div
        onClick={handleCopy}
        className={`flex cursor-pointer gap-3 rounded-lg px-3 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 lg:gap-4 lg:px-5 lg:py-5 ${isEven ? "bg-gray-50/50 dark:bg-gray-800/20" : ""}`}
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleCopy();
          }
        }}
      >
        <PlaylistImage imageUrl={track.imageUrl} title={track.title} />

        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
          <div className="flex items-baseline gap-2">
            <span className="shrink-0 text-xs text-gray-400 dark:text-gray-500 lg:text-sm lg:font-medium">{time}</span>
            <span className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100 lg:text-base">{track.title}</span>
          </div>

          <span className="truncate text-xs text-gray-600 dark:text-gray-400 lg:text-sm">{track.artists}</span>

          {track.album && <span className="truncate text-xs text-gray-400 italic dark:text-gray-500">{track.album}</span>}

          <StreamingButtons track={track} />
        </div>
      </div>

      <Toast message={toast.message} visible={toast.visible} />
    </>
  );
}
