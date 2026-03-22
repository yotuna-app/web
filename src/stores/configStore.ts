import { create } from "zustand";
import { appSettings } from "@/constants/app";
import type { AppConfig } from "@/types";

const CONFIG_KEY = "yotuna-config";

interface ConfigState {
  appConfig: AppConfig;
  setConfig: (config: AppConfig) => void;
  getConfig: () => AppConfig;
}

function loadConfig(): AppConfig {
  try {
    const stored = localStorage.getItem(CONFIG_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return appSettings as AppConfig;
}

export const useConfigStore = create<ConfigState>((set, get) => ({
  appConfig: loadConfig(),

  setConfig: (config) => {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    set({ appConfig: config });
  },

  getConfig: () => get().appConfig,
}));
