import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAudioStore } from "@/stores/audioStore";

// Mock analytics
vi.mock("@/analytics", () => ({
  tracker: { trackEvent: vi.fn() },
  AnalyticsEvents: {
    AUDIO_PLAY: "audio_play",
    AUDIO_PAUSE: "audio_pause",
    AUDIO_STOP: "audio_stop",
    ERROR_OCCURRED: "error_occurred",
  },
}));

describe("audioStore", () => {
  beforeEach(() => {
    useAudioStore.setState({
      audio: null,
      currentStationId: null,
      currentStationName: null,
      currentStreamUrl: null,
      isPlaying: false,
      isBuffering: false,
    });
  });

  it("starts with no audio playing", () => {
    const state = useAudioStore.getState();
    expect(state.currentStationId).toBeNull();
    expect(state.isPlaying).toBe(false);
    expect(state.isBuffering).toBe(false);
  });

  it("sets station info on playAudio", () => {
    useAudioStore.getState().playAudio("http://stream.url/audio", "station-1", "Test Radio");
    const state = useAudioStore.getState();
    expect(state.currentStationId).toBe("station-1");
    expect(state.currentStationName).toBe("Test Radio");
    expect(state.currentStreamUrl).toBe("http://stream.url/audio");
  });

  it("stops audio and clears state", () => {
    useAudioStore.getState().playAudio("http://stream.url/audio", "station-1", "Test Radio");
    useAudioStore.getState().stopAudio();
    const state = useAudioStore.getState();
    expect(state.currentStationId).toBeNull();
    expect(state.currentStationName).toBeNull();
    expect(state.currentStreamUrl).toBeNull();
    expect(state.isPlaying).toBe(false);
  });

  it("pauses audio", () => {
    useAudioStore.getState().playAudio("http://stream.url/audio", "station-1");
    useAudioStore.getState().pauseAudio();
    expect(useAudioStore.getState().isPlaying).toBe(false);
  });

  it("toggles play/pause for same station", () => {
    // First play
    useAudioStore.getState().playAudio("http://stream.url/audio", "station-1");
    const audio = useAudioStore.getState().audio;
    expect(audio).not.toBeNull();

    // Simulate playing state
    useAudioStore.setState({ isPlaying: true });

    // Second call to same station should pause
    useAudioStore.getState().playAudio("http://stream.url/audio", "station-1");
    expect(useAudioStore.getState().isPlaying).toBe(false);
  });

  it("switches station on different station play", () => {
    useAudioStore.getState().playAudio("http://stream1.url", "station-1", "Radio 1");
    useAudioStore.getState().playAudio("http://stream2.url", "station-2", "Radio 2");
    const state = useAudioStore.getState();
    expect(state.currentStationId).toBe("station-2");
    expect(state.currentStationName).toBe("Radio 2");
  });
});
