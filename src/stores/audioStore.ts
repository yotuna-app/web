import { create } from "zustand";
import { tracker, AnalyticsEvents } from "@/analytics";

interface AudioState {
  audio: HTMLAudioElement | null;
  currentStationId: string | null;
  currentStationName: string | null;
  currentStreamUrl: string | null;
  isPlaying: boolean;
  isBuffering: boolean;
  playbackError: string | null;
  playAudio: (url: string, stationId: string, stationName?: string) => void;
  stopAudio: () => void;
  pauseAudio: () => void;
  resumeAudio: () => void;
  clearPlaybackError: () => void;
}

const BUFFER_TIMEOUT_MS = 10000; // 10 seconds max connection timeout to prevent infinite spinner
let bufferTimeoutId: ReturnType<typeof setTimeout> | null = null;

function clearBufferTimeout() {
  if (bufferTimeoutId !== null) {
    clearTimeout(bufferTimeoutId);
    bufferTimeoutId = null;
  }
}

export const useAudioStore = create<AudioState>((set, get) => ({
  audio: null,
  currentStationId: null,
  currentStationName: null,
  currentStreamUrl: null,
  isPlaying: false,
  isBuffering: false,
  playbackError: null,

  clearPlaybackError: () => set({ playbackError: null }),

  playAudio: (url: string, stationId: string, stationName?: string) => {
    const state = get();

    // Toggle play/pause for the same station
    if (state.currentStationId === stationId && state.audio) {
      if (state.isPlaying) {
        state.pauseAudio();
        return;
      } else {
        state.resumeAudio();
        return;
      }
    }

    // Stop current audio if different station
    if (state.audio) {
      state.stopAudio();
    }

    clearBufferTimeout();

    try {
      const audio = new Audio(url);

      set({
        audio,
        currentStationId: stationId,
        currentStationName: stationName ?? null,
        currentStreamUrl: url,
        isBuffering: true,
        playbackError: null,
      });

      // Timeout watchdog: if stream doesn't start playing within 10s, cancel and report error
      bufferTimeoutId = setTimeout(() => {
        const current = get();
        if (current.isBuffering && current.currentStationId === stationId) {
          console.warn("[Audio] Connection timeout after 10s for station:", stationId);
          current.stopAudio();
          const errorMsg = "Stream connection timed out";
          set({
            isBuffering: false,
            isPlaying: false,
            playbackError: errorMsg,
          });
          tracker.trackEvent(AnalyticsEvents.ERROR_OCCURRED, {
            type: "audio_timeout_error",
            stationId,
          });
          if (typeof window !== "undefined") {
            window.dispatchEvent(
              new CustomEvent("yotuna:audio-error", {
                detail: { stationId, message: errorMsg },
              }),
            );
          }
        }
      }, BUFFER_TIMEOUT_MS);

      audio.addEventListener("playing", () => {
        clearBufferTimeout();
        set({ isPlaying: true, isBuffering: false, playbackError: null });
      });

      audio.addEventListener("waiting", () => {
        set({ isBuffering: true });
      });

      audio.addEventListener("stalled", () => {
        const current = get();
        if (current.isBuffering) {
          console.warn("[Audio] Stream stalled during buffering:", stationId);
        }
      });

      audio.addEventListener("pause", () => {
        set({ isPlaying: false });
      });

      audio.addEventListener("ended", () => {
        clearBufferTimeout();
        set({ isPlaying: false, isBuffering: false });
      });

      audio.addEventListener("abort", () => {
        clearBufferTimeout();
        set({ isBuffering: false });
      });

      audio.addEventListener("error", (e) => {
        clearBufferTimeout();
        console.error("[Audio] Playback error for station:", stationId, e);
        const errorMsg = "Audio playback failed";
        set({ isPlaying: false, isBuffering: false, playbackError: errorMsg });
        tracker.trackEvent(AnalyticsEvents.ERROR_OCCURRED, {
          type: "audio_play_error",
          stationId,
        });
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("yotuna:audio-error", {
              detail: { stationId, message: errorMsg },
            }),
          );
        }
      });

      audio.play().catch((err) => {
        clearBufferTimeout();
        console.error("[Audio] Failed to play:", err);
        const errorMsg = "Audio playback failed";
        set({ isPlaying: false, isBuffering: false, playbackError: errorMsg });
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("yotuna:audio-error", {
              detail: { stationId, message: errorMsg },
            }),
          );
        }
      });

      tracker.trackEvent(AnalyticsEvents.AUDIO_PLAY, { stationId });
    } catch (err) {
      clearBufferTimeout();
      console.error("[Audio] Error creating audio:", err);
      const errorMsg = String(err);
      set({ isBuffering: false, isPlaying: false, playbackError: errorMsg });
      tracker.trackEvent(AnalyticsEvents.ERROR_OCCURRED, {
        type: "audio_play_error",
        stationId,
        error: errorMsg,
      });
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("yotuna:audio-error", {
            detail: { stationId, message: errorMsg },
          }),
        );
      }
    }
  },

  stopAudio: () => {
    clearBufferTimeout();
    const { audio, currentStationId } = get();
    if (audio) {
      audio.pause();
      audio.src = "";
      audio.load();
      tracker.trackEvent(AnalyticsEvents.AUDIO_STOP, { stationId: currentStationId });
    }
    set({
      audio: null,
      currentStationId: null,
      currentStationName: null,
      currentStreamUrl: null,
      isPlaying: false,
      isBuffering: false,
    });
  },

  pauseAudio: () => {
    clearBufferTimeout();
    const { audio, currentStationId } = get();
    if (audio) {
      audio.pause();
      set({ isPlaying: false, isBuffering: false });
      tracker.trackEvent(AnalyticsEvents.AUDIO_PAUSE, { stationId: currentStationId });
    }
  },

  resumeAudio: () => {
    const { audio, currentStationId } = get();
    if (audio) {
      clearBufferTimeout();
      set({ isBuffering: true, playbackError: null });

      bufferTimeoutId = setTimeout(() => {
        const current = get();
        if (current.isBuffering && current.currentStationId === currentStationId) {
          console.warn("[Audio] Resume timeout after 10s for station:", currentStationId);
          current.stopAudio();
          set({ isBuffering: false, isPlaying: false, playbackError: "Stream connection timed out" });
        }
      }, BUFFER_TIMEOUT_MS);

      audio.play().catch((err) => {
        clearBufferTimeout();
        console.error("[Audio] Failed to resume:", err);
        set({ isBuffering: false, isPlaying: false, playbackError: "Audio resume failed" });
      });
      tracker.trackEvent(AnalyticsEvents.AUDIO_PLAY, { stationId: currentStationId });
    }
  },
}));
