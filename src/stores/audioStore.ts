import { create } from "zustand";
import { tracker, AnalyticsEvents } from "@/analytics";

interface AudioState {
  audio: HTMLAudioElement | null;
  currentStationId: string | null;
  currentStationName: string | null;
  currentStreamUrl: string | null;
  isPlaying: boolean;
  isBuffering: boolean;
  playAudio: (url: string, stationId: string, stationName?: string) => void;
  stopAudio: () => void;
  pauseAudio: () => void;
  resumeAudio: () => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  audio: null,
  currentStationId: null,
  currentStationName: null,
  currentStreamUrl: null,
  isPlaying: false,
  isBuffering: false,

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

    try {
      const audio = new Audio(url);

      set({
        audio,
        currentStationId: stationId,
        currentStationName: stationName ?? null,
        currentStreamUrl: url,
        isBuffering: true,
      });

      audio.addEventListener("playing", () => {
        set({ isPlaying: true, isBuffering: false });
      });

      audio.addEventListener("waiting", () => {
        set({ isBuffering: true });
      });

      audio.addEventListener("pause", () => {
        set({ isPlaying: false });
      });

      audio.addEventListener("ended", () => {
        set({ isPlaying: false, isBuffering: false });
      });

      audio.addEventListener("error", () => {
        console.error("[Audio] Playback error for station:", stationId);
        set({ isPlaying: false, isBuffering: false });
        tracker.trackEvent(AnalyticsEvents.ERROR_OCCURRED, {
          type: "audio_play_error",
          stationId,
        });
      });

      audio.play().catch((err) => {
        console.error("[Audio] Failed to play:", err);
        set({ isPlaying: false, isBuffering: false });
      });

      tracker.trackEvent(AnalyticsEvents.AUDIO_PLAY, { stationId });
    } catch (err) {
      console.error("[Audio] Error creating audio:", err);
      set({ isBuffering: false, isPlaying: false });
      tracker.trackEvent(AnalyticsEvents.ERROR_OCCURRED, {
        type: "audio_play_error",
        stationId,
        error: String(err),
      });
    }
  },

  stopAudio: () => {
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
    const { audio, currentStationId } = get();
    if (audio) {
      audio.pause();
      set({ isPlaying: false });
      tracker.trackEvent(AnalyticsEvents.AUDIO_PAUSE, { stationId: currentStationId });
    }
  },

  resumeAudio: () => {
    const { audio, currentStationId } = get();
    if (audio) {
      set({ isBuffering: true });
      audio.play().catch((err) => {
        console.error("[Audio] Failed to resume:", err);
        set({ isBuffering: false, isPlaying: false });
      });
      tracker.trackEvent(AnalyticsEvents.AUDIO_PLAY, { stationId: currentStationId });
    }
  },
}));
