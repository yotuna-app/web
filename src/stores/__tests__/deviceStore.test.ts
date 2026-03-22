import { describe, it, expect, beforeEach } from "vitest";
import { useDeviceStore } from "@/stores/deviceStore";

describe("deviceStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useDeviceStore.setState({ deviceId: null });
  });

  it("starts with null deviceId", () => {
    expect(useDeviceStore.getState().deviceId).toBeNull();
  });

  it("generates a device ID", () => {
    const id = useDeviceStore.getState().generateDeviceId();
    expect(id).toBeTruthy();
    expect(typeof id).toBe("string");
    expect(id.length).toBeGreaterThan(10);
  });

  it("persists device ID to localStorage", () => {
    const id = useDeviceStore.getState().generateDeviceId();
    expect(localStorage.getItem("yotuna-device-id")).toBe(id);
  });

  it("returns same ID on subsequent calls", () => {
    const id1 = useDeviceStore.getState().generateDeviceId();
    const id2 = useDeviceStore.getState().generateDeviceId();
    expect(id1).toBe(id2);
  });

  it("updates state after generation", () => {
    const id = useDeviceStore.getState().generateDeviceId();
    expect(useDeviceStore.getState().deviceId).toBe(id);
  });
});
