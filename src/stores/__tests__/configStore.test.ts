import { describe, it, expect, beforeEach } from "vitest";
import { useConfigStore } from "@/stores/configStore";
import { appSettings } from "@/constants/app";
import type { AppConfig } from "@/types";

describe("configStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useConfigStore.setState({ appConfig: appSettings as AppConfig });
  });

  it("starts with default config", () => {
    const { appConfig } = useConfigStore.getState();
    expect(appConfig.favoritesLimit).toBe(50);
    expect(appConfig.stationsPageLimit).toBe(50);
    expect(appConfig.playlistDaysBack).toBe(6);
  });

  it("updates config", () => {
    const newConfig: AppConfig = {
      ...appSettings,
      favoritesLimit: 100,
      playlistDaysBack: 10,
    } as AppConfig;

    useConfigStore.getState().setConfig(newConfig);
    expect(useConfigStore.getState().appConfig.favoritesLimit).toBe(100);
    expect(useConfigStore.getState().appConfig.playlistDaysBack).toBe(10);
  });

  it("persists config to localStorage", () => {
    const newConfig = { ...appSettings, favoritesLimit: 75 } as AppConfig;
    useConfigStore.getState().setConfig(newConfig);
    const stored = JSON.parse(localStorage.getItem("yotuna-config")!);
    expect(stored.favoritesLimit).toBe(75);
  });

  it("getConfig returns current state", () => {
    const config = useConfigStore.getState().getConfig();
    expect(config).toEqual(useConfigStore.getState().appConfig);
  });
});
