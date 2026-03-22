// Analytics tracker -- verbose console logging in dev, silent in production.
// Production builds strip console.log/info/debug/trace via esbuild pure config.

import type { AnalyticsEvent } from "./events";

interface TrackEventData {
  [key: string]: unknown;
}

class AnalyticsTracker {
  private context: string = "global";

  trackEvent(event: AnalyticsEvent, data?: TrackEventData): void {
    const timestamp = new Date().toISOString();
    const payload = {
      event,
      context: this.context,
      timestamp,
      ...data,
    };

    console.log(`%c[Analytics] %c${event}`, "color: #007AFF; font-weight: bold;", "color: #3b82f6; font-weight: bold;", payload);

    if (!import.meta.env.DEV) {
      this.sendToAnalyticsService(payload);
    }
  }

  trackPageView(page: string): void {
    this.trackEvent("page_view" as AnalyticsEvent, { page });
  }

  trackInteraction(element: string, action: string, data?: TrackEventData): void {
    console.info(`%c[Interaction] %c${element} → ${action}`, "color: #f59e0b; font-weight: bold;", "color: #10b981;", data);
    this.trackEvent(`${element}_${action}` as AnalyticsEvent, data);
  }

  setContext(context: string): void {
    this.context = context;
    console.debug(`[Analytics] Context set to: ${context}`);
  }

  debug(message: string, ...args: unknown[]): void {
    console.debug(`[Debug] ${message}`, ...args);
  }

  info(message: string, ...args: unknown[]): void {
    console.info(`[Info] ${message}`, ...args);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private sendToAnalyticsService(_payload: Record<string, unknown>): void {
    // TODO: Integrate with Amplitude, Google Analytics, Plausible, or PostHog
    // Example: window.gtag?.('event', payload.event, payload);
  }
}

export const tracker = new AnalyticsTracker();

export function useTracker(componentName: string) {
  tracker.setContext(componentName);

  return {
    trackEvent: (event: AnalyticsEvent, data?: TrackEventData) => tracker.trackEvent(event, data),
    trackInteraction: (element: string, action: string, data?: TrackEventData) => tracker.trackInteraction(element, action, data),
    trackPageView: (page: string) => tracker.trackPageView(page),
    debug: (message: string, ...args: unknown[]) => tracker.debug(message, ...args),
    info: (message: string, ...args: unknown[]) => tracker.info(message, ...args),
  };
}
