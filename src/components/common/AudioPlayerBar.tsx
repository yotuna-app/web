import { Pause, Play, Square } from "lucide-react";
import { useAudioStore } from "@/stores";

export default function AudioPlayerBar() {
  const { currentStationId, currentStationName, currentStreamUrl, isPlaying, playAudio, pauseAudio, stopAudio } = useAudioStore();

  if (!currentStationId) return null;

  function handleTogglePlay() {
    if (isPlaying) {
      pauseAudio();
    } else if (currentStreamUrl) {
      playAudio(currentStreamUrl, currentStationId!, currentStationName ?? undefined);
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200/60 bg-white/80 backdrop-blur-lg dark:border-gray-700/60 dark:bg-gray-900/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-3 overflow-hidden">
          {isPlaying && (
            <div className="flex h-4 items-end gap-0.5">
              <span className="equalizer-bar w-1 rounded-full bg-primary-500" />
              <span className="equalizer-bar w-1 rounded-full bg-primary-500 [animation-delay:0.2s]" />
              <span className="equalizer-bar w-1 rounded-full bg-primary-500 [animation-delay:0.4s]" />
            </div>
          )}
          <span className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{currentStationName ?? currentStationId}</span>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={handleTogglePlay} className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-500 text-white transition-colors hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-500">
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
          </button>
          <button type="button" onClick={stopAudio} className="inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200">
            <Square className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
