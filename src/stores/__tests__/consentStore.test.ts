import { describe, it, expect, beforeEach } from "vitest";
import { useConsentStore } from "@/stores/consentStore";

describe("consentStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useConsentStore.setState({ hasGivenConsent: null });
  });

  it("starts with null consent", () => {
    expect(useConsentStore.getState().hasGivenConsent).toBeNull();
  });

  it("sets consent to true", () => {
    useConsentStore.getState().setHasGivenConsent(true);
    expect(useConsentStore.getState().hasGivenConsent).toBe(true);
    expect(JSON.parse(localStorage.getItem("yotuna-consent")!)).toBe(true);
  });

  it("sets consent to false", () => {
    useConsentStore.getState().setHasGivenConsent(false);
    expect(useConsentStore.getState().hasGivenConsent).toBe(false);
    expect(JSON.parse(localStorage.getItem("yotuna-consent")!)).toBe(false);
  });

  it("resets consent to null", () => {
    useConsentStore.getState().setHasGivenConsent(true);
    useConsentStore.getState().setHasGivenConsent(null);
    expect(useConsentStore.getState().hasGivenConsent).toBeNull();
    expect(localStorage.getItem("yotuna-consent")).toBeNull();
  });
});
