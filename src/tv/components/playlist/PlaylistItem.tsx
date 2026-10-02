import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { formatPlaylistTime } from "@/utils/dates";
import PlaylistImage from "./PlaylistImage";
import type { PlaylistTrack } from "@/types";

interface PlaylistItemProps {
  track: PlaylistTrack;
  isEven?: boolean;
}

export default function PlaylistItem({ track, isEven }: PlaylistItemProps) {
  const time = formatPlaylistTime(track.startedAt);

  const { ref, focused } = useFocusable({
    onFocus: ({ node }) => {
      node?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    },
  });

  return (
    <div
      ref={ref}
      className={`flex gap-tv-3 rounded-tv-lg px-tv-3 py-tv-3 tv-card-focus ${focused ? "focused" : ""} ${
        isEven ? "bg-gray-900/50" : ""
      }`}
    >
      <PlaylistImage imageUrl={track.imageUrl} title={track.title} />

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
        <div className="flex items-baseline gap-3">
          <span className="shrink-0 text-tv-xs text-gray-500">{time}</span>
          <span className="truncate text-tv-sm font-semibold text-white">{track.title}</span>
        </div>

        <span className="truncate text-tv-xs text-gray-400">{track.artists}</span>

        {track.album && <span className="truncate text-tv-xs italic text-gray-600">{track.album}</span>}
      </div>
    </div>
  );
}
