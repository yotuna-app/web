import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { Play, Pause, Loader2 } from "lucide-react";
import { useAudioStore } from "@/stores";

interface PlayButtonProps {
  stationId: string;
  streamUrl?: string;
  stationName: string;
}

export default function PlayButton({ stationId, streamUrl, stationName }: PlayButtonProps) {
  const { currentStationId, isPlaying, isBuffering, playAudio, pauseAudio } = useAudioStore();
  const isCurrentStation = currentStationId === stationId;
  const isActive = isCurrentStation && isPlaying;

  const handleToggle = () => {
    if (isCurrentStation && isPlaying) {
      pauseAudio();
    } else if (streamUrl) {
      playAudio(streamUrl, stationId, stationName);
    }
  };

  const { ref, focused } = useFocusable({
    onEnterPress: handleToggle,
  });

  return (
    <div
      ref={ref}
      onClick={handleToggle}
      className={`flex h-14 w-14 items-center justify-center rounded-full tv-btn-focus cursor-pointer ${
        isActive ? "bg-primary-600" : "bg-gray-700"
      } ${focused ? "focused" : ""}`}
    >
      {isCurrentStation && isBuffering ? (
        <Loader2 className="h-7 w-7 text-white animate-spin" />
      ) : isActive ? (
        <Pause className="h-7 w-7 text-white" />
      ) : (
        <Play className="h-7 w-7 text-white" />
      )}
    </div>
  );
}
