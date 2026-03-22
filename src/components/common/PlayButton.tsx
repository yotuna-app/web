import { Loader2, Pause, Play } from "lucide-react";
import { useAudioStore } from "@/stores";

interface PlayButtonProps {
  stationId: string;
  streamUrl?: string;
  stationName?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses: Record<string, { button: string; icon: string }> = {
  sm: { button: "h-8 w-8", icon: "h-3.5 w-3.5" },
  md: { button: "h-10 w-10", icon: "h-4 w-4" },
  lg: { button: "h-12 w-12", icon: "h-5 w-5" },
};

export default function PlayButton({ stationId, streamUrl, stationName, size = "md" }: PlayButtonProps) {
  const { currentStationId, isPlaying, isBuffering, playAudio, pauseAudio } = useAudioStore();
  const isCurrentStation = currentStationId === stationId;
  const { button, icon } = sizeClasses[size];

  function handleClick() {
    if (isCurrentStation && isPlaying) {
      pauseAudio();
    } else if (streamUrl) {
      playAudio(streamUrl, stationId, stationName);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!streamUrl}
      className={`${button} inline-flex shrink-0 items-center justify-center rounded-full bg-primary-500 text-white shadow-sm transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-primary-600 dark:hover:bg-primary-500`}
    >
      {isCurrentStation && isBuffering ? (
        <Loader2 className={`${icon} animate-spin`} />
      ) : isCurrentStation && isPlaying ? (
        <Pause className={icon} />
      ) : (
        <Play className={`${icon} ml-0.5`} />
      )}
    </button>
  );
}
