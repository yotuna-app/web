import { describe, it, expect } from "vitest";
import { createInitialState, navigateTo, goBack, canGoBack } from "../navigation";

describe("TV navigation state", () => {
  it("creates initial state with home page", () => {
    const state = createInitialState();
    expect(state.current.page).toBe("home");
    expect(state.stack).toEqual([]);
    expect(canGoBack(state)).toBe(false);
  });

  it("navigates to a new page and pushes current to stack", () => {
    const s1 = createInitialState();
    const s2 = navigateTo(s1, "search");
    expect(s2.current.page).toBe("search");
    expect(s2.stack.length).toBe(1);
    expect(s2.stack[0].page).toBe("home");
    expect(canGoBack(s2)).toBe(true);
  });

  it("navigates with params", () => {
    const s1 = createInitialState();
    const s2 = navigateTo(s1, "station", { name: "Radio Paradise" });
    expect(s2.current.page).toBe("station");
    expect(s2.current.params?.name).toBe("Radio Paradise");
  });

  it("goes back in history correctly", () => {
    const s1 = createInitialState();
    const s2 = navigateTo(s1, "search");
    const s3 = navigateTo(s2, "settings");
    expect(s3.stack.length).toBe(2);

    const s4 = goBack(s3);
    expect(s4.current.page).toBe("search");
    expect(s4.stack.length).toBe(1);

    const s5 = goBack(s4);
    expect(s5.current.page).toBe("home");
    expect(s5.stack.length).toBe(0);
    expect(canGoBack(s5)).toBe(false);
  });
});
