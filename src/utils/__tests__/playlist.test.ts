import { describe, it, expect } from "vitest";
import { mergePlaylistTrack } from "../playlist";
import type { StationPlaylistResponse } from "@/types";

describe("mergePlaylistTrack", () => {
  const basePrev: StationPlaylistResponse = {
    getStationPlaylist: {
      entries: [
        {
          startedAt: "2026-11-21T16:00:00.000Z",
          title: "Take Five",
          artists: "Dave Brubeck",
          album: "Time Out",
        },
      ],
      total: 1,
    },
  };

  it("prepends a new track in descending order and increments total", () => {
    const next = mergePlaylistTrack(basePrev, {
      startedAt: "2026-11-21T16:05:00.000Z",
      title: "So What",
      artists: "Miles Davis",
    });

    expect(next.getStationPlaylist.total).toBe(2);
    expect(next.getStationPlaylist.entries.map((e) => e.title)).toEqual(["So What", "Take Five"]);
  });

  it("updates an existing track in-place when startedAt matches", () => {
    const next = mergePlaylistTrack(basePrev, {
      startedAt: "2026-11-21T16:00:00Z",
      title: "Take Five",
      artists: "Dave Brubeck",
      spotifyTrackId: "sp-123",
      deezerTrackId: "dz-456",
    });

    expect(next.getStationPlaylist.total).toBe(1);
    expect(next.getStationPlaylist.entries).toHaveLength(1);
    expect(next.getStationPlaylist.entries[0].spotifyTrackId).toBe("sp-123");
    expect(next.getStationPlaylist.entries[0].deezerTrackId).toBe("dz-456");
  });

  it("returns prev unchanged when incoming is null or undefined", () => {
    expect(mergePlaylistTrack(basePrev, null)).toBe(basePrev);
    expect(mergePlaylistTrack(basePrev, undefined)).toBe(basePrev);
  });
});
