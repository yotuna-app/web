import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
  localStorage.clear();
});

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  value: MockIntersectionObserver,
});

// Mock clipboard
Object.defineProperty(navigator, "clipboard", {
  writable: true,
  configurable: true,
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
    readText: vi.fn().mockResolvedValue(""),
  },
});

// Mock HTMLMediaElement
Object.defineProperty(window.HTMLMediaElement.prototype, "play", {
  writable: true,
  value: vi.fn().mockResolvedValue(undefined),
});
Object.defineProperty(window.HTMLMediaElement.prototype, "pause", {
  writable: true,
  value: vi.fn(),
});
Object.defineProperty(window.HTMLMediaElement.prototype, "load", {
  writable: true,
  value: vi.fn(),
});

// Mock scrollIntoView (not implemented in jsdom)
Element.prototype.scrollIntoView = vi.fn();
