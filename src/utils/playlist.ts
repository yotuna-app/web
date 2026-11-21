import type { PlaylistTrack, StationPlaylistResponse } from "@/types";

/**
 * Merges a live WebSocket playlist track update into the cached Apollo query result.
 * - If a track with the same startedAt timestamp already exists (e.g. streaming IDs were resolved),
 *   it updates that entry in-place.
 * - Otherwise, inserts the new track in descending startedAt order and increments total.
 */
export function mergePlaylistTrack(prev: StationPlaylistResponse, incoming: PlaylistTrack | null | undefined): StationPlaylistResponse {
  if (!incoming || !incoming.startedAt) {
    return prev;
  }

  const existingEntries = prev.getStationPlaylist?.entries ?? [];
  const existingTotal = prev.getStationPlaylist?.total ?? existingEntries.length;
  const incomingTime = new Date(incoming.startedAt).getTime();

  const existingIndex = existingEntries.findIndex((entry) => new Date(entry.startedAt).getTime() === incomingTime);

  if (existingIndex !== -1) {
    const updatedEntries = [...existingEntries];
    updatedEntries[existingIndex] = {
      ...existingEntries[existingIndex],
      ...incoming,
    };
    return {
      ...prev,
      getStationPlaylist: {
        ...prev.getStationPlaylist,
        entries: updatedEntries,
        total: existingTotal,
      },
    };
  }

  const updatedEntries = [incoming, ...existingEntries].sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
  );

  return {
    ...prev,
    getStationPlaylist: {
      ...prev.getStationPlaylist,
      entries: updatedEntries,
      total: existingTotal + 1,
    },
  };
}
