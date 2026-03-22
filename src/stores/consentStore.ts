import { create } from "zustand";

const CONSENT_KEY = "yotuna-consent";

interface ConsentState {
  hasGivenConsent: boolean | null;
  setHasGivenConsent: (value: boolean | null) => void;
}

function loadConsent(): boolean | null {
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored === null) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export const useConsentStore = create<ConsentState>((set) => ({
  hasGivenConsent: loadConsent(),

  setHasGivenConsent: (value) => {
    if (value === null) {
      localStorage.removeItem(CONSENT_KEY);
    } else {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(value));
    }
    set({ hasGivenConsent: value });
  },
}));
