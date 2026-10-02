import { useAudioStore } from "@/stores";
import { useFocusable, FocusContext } from "@noriginmedia/norigin-spatial-navigation";
import { Play, Pause, Square } from "lucide-react";

export default function AudioPlayerBar() {
  const { currentStationId, currentStationName, currentStreamUrl, isPlaying, playAudio, pauseAudio, stopAudio } = useAudioStore();

  const { ref: containerRef, focusKey } = useFocusable({
    focusKey: "audio-player",
    isFocusBoundary: false,
    focusable: !!currentStationId,
  });

  const handleTogglePlay = () => {
    if (isPlaying) {
      pauseAudio();
    } else if (currentStreamUrl) {
      playAudio(currentStreamUrl, currentStationId!, currentStationName ?? undefined);
    }
  };

  const { ref: playRef, focused: playFocused } = useFocusable({
    focusKey: "audio-play",
    focusable: !!currentStationId,
    onEnterPress: handleTogglePlay,
  });

  const { ref: stopRef, focused: stopFocused } = useFocusable({
    focusKey: "audio-stop",
    focusable: !!currentStationId,
    onEnterPress: stopAudio,
  });

  if (!currentStationId) {
    return null;
  }

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={containerRef} className="flex items-center gap-tv-4 border-t border-gray-800 bg-gray-900 px-tv-4 py-tv-2">
        {/* Station info */}
        <div className="min-w-0 flex-1">
          {isPlaying && (
            <div className="mb-1 flex h-4 items-end gap-0.5">
              <span className="w-1 rounded-full bg-primary-500 animate-pulse" style={{ height: "12px" }} />
              <span className="w-1 rounded-full bg-primary-500 animate-pulse" style={{ height: "16px", animationDelay: "0.2s" }} />
              <span className="w-1 rounded-full bg-primary-500 animate-pulse" style={{ height: "8px", animationDelay: "0.4s" }} />
            </div>
          )}
          <p className="truncate text-tv-sm font-semibold text-white">{currentStationName ?? currentStationId}</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-tv-2">
          {/* Play / Pause */}
          <div
            ref={playRef}
            onClick={handleTogglePlay}
            className={`flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 tv-btn-focus cursor-pointer ${playFocused ? "focused" : ""}`}
          >
            {isPlaying ? <Pause className="h-7 w-7 text-white" /> : <Play className="h-7 w-7 text-white" />}
          </div>

          {/* Stop */}
          <div
            ref={stopRef}
            onClick={stopAudio}
            className={`flex h-12 w-12 items-center justify-center rounded-full tv-btn-focus cursor-pointer ${stopFocused ? "focused" : ""}`}
          >
            <Square className="h-6 w-6 text-gray-400" />
          </div>
        </div>
      </div>
    </FocusContext.Provider>
  );
}
