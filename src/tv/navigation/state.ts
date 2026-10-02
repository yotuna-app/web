/**
 * TV navigation state management.
 * Manages which "page" / view is currently active on the TV app.
 * TV doesn't use URL-based routing - it uses a simple state machine.
 */

export type TVPage = "home" | "search" | "station" | "settings" | "about";

export interface NavigationState {
  page: TVPage;
  params?: Record<string, string>;
}

export interface NavigationHistory {
  stack: NavigationState[];
  current: NavigationState;
}

export function createInitialState(): NavigationHistory {
  return {
    stack: [],
    current: { page: "home" },
  };
}

export function navigateTo(history: NavigationHistory, page: TVPage, params?: Record<string, string>): NavigationHistory {
  if (history.current.page === page && JSON.stringify(history.current.params ?? null) === JSON.stringify(params ?? null)) {
    return history;
  }
  return {
    stack: [...history.stack, history.current],
    current: { page, params },
  };
}

export function goBack(history: NavigationHistory): NavigationHistory {
  if (history.stack.length === 0) {
    return history; // Already at root
  }

  const newStack = [...history.stack];
  const previous = newStack.pop()!;
  return {
    stack: newStack,
    current: previous,
  };
}

export function canGoBack(history: NavigationHistory): boolean {
  return history.stack.length > 0;
}
