import { describe, it, expect } from "vitest";
import { getGooglePlayUrl, getAndroidIntentUrl } from "@/utils/deepLink";
import { appSettings } from "@/constants/app";

describe("deepLink utility", () => {
  const pkg = appSettings.store.androidPackage;
  const encodedPlayStoreUrl = encodeURIComponent(`https://play.google.com/store/apps/details?id=${pkg}`);

  it("returns correct Google Play URL", () => {
    const playUrl = getGooglePlayUrl();
    expect(playUrl).toBe(`https://play.google.com/store/apps/details?id=${pkg}`);
  });

  it("generates home intent URL for root path", () => {
    const intentUrl = getAndroidIntentUrl("/");
    expect(intentUrl).toBe(
      `intent://home#Intent;scheme=yotuna;package=${pkg};S.browser_fallback_url=${encodedPlayStoreUrl};end;`
    );
  });

  it("generates home intent URL for non-station routes", () => {
    const intentUrlFavorites = getAndroidIntentUrl("/favorites");
    expect(intentUrlFavorites).toBe(
      `intent://home#Intent;scheme=yotuna;package=${pkg};S.browser_fallback_url=${encodedPlayStoreUrl};end;`
    );

    const intentUrlSettings = getAndroidIntentUrl("/settings");
    expect(intentUrlSettings).toBe(
      `intent://home#Intent;scheme=yotuna;package=${pkg};S.browser_fallback_url=${encodedPlayStoreUrl};end;`
    );
  });

  it("generates station intent URL for station detail page", () => {
    const intentUrl = getAndroidIntentUrl("/station/pl-radio-nowy-swiat");
    expect(intentUrl).toBe(
      `intent://station/pl-radio-nowy-swiat#Intent;scheme=yotuna;package=${pkg};S.browser_fallback_url=${encodedPlayStoreUrl};end;`
    );
  });

  it("extracts stationId properly when path contains query parameters or hash", () => {
    const intentUrl = getAndroidIntentUrl("/station/pl-radio-357?tab=playlist#top");
    expect(intentUrl).toBe(
      `intent://station/pl-radio-357#Intent;scheme=yotuna;package=${pkg};S.browser_fallback_url=${encodedPlayStoreUrl};end;`
    );
  });
});
