import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useToast } from "@/hooks/useToast";

describe("useToast", () => {
  it("starts with hidden toast", () => {
    const { result } = renderHook(() => useToast());
    expect(result.current.toast.visible).toBe(false);
    expect(result.current.toast.message).toBe("");
  });

  it("shows a toast message", () => {
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.showToast("Hello!");
    });
    expect(result.current.toast.visible).toBe(true);
    expect(result.current.toast.message).toBe("Hello!");
  });

  it("hides toast manually", () => {
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.showToast("Hello!");
    });
    act(() => {
      result.current.hideToast();
    });
    expect(result.current.toast.visible).toBe(false);
  });

  it("hides toast after duration", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useToast(1000));
    act(() => {
      result.current.showToast("Temp message");
    });
    expect(result.current.toast.visible).toBe(true);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.toast.visible).toBe(false);
    vi.useRealTimers();
  });

  it("resets timer when called again before timeout", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useToast(1000));
    act(() => {
      result.current.showToast("First");
    });
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current.toast.visible).toBe(true);
    act(() => {
      result.current.showToast("Second");
    });
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current.toast.visible).toBe(true);
    expect(result.current.toast.message).toBe("Second");
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current.toast.visible).toBe(false);
    vi.useRealTimers();
  });
});
