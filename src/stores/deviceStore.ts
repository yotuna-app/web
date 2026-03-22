import { create } from "zustand";

const DEVICE_KEY = "yotuna-device-id";

interface DeviceState {
  deviceId: string | null;
  generateDeviceId: () => string;
}

function generateId(): string {
  // Use crypto.randomUUID if available, otherwise fallback
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const useDeviceStore = create<DeviceState>((set, get) => ({
  deviceId: localStorage.getItem(DEVICE_KEY),

  generateDeviceId: () => {
    const existing = get().deviceId;
    if (existing) return existing;

    const id = generateId();
    localStorage.setItem(DEVICE_KEY, id);
    set({ deviceId: id });
    return id;
  },
}));
